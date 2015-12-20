angular.module("cp").controller("addEditGroupCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', '$mdToast', 'storageService','$timeout', 'Upload', 'dataService',
function ($scope, $log, $q, $state, $stateParams, $mdToast,  storageService, $timeout, Upload, dataService){
	$scope.$parent.currentViewName = "Edit Group";
	$scope.defaultImage = "./content/images/group-default3.png"
	$scope.toastPosition = 'top';
	$scope.message = "";
	$scope.current = {
		action:"Create",
	    id:0,
	    group:{}
	};
	
	if($stateParams.id=0)
	{
        $scope.$parent.currentViewName = "Create Group" ;
        $scope.current.id = $stateParams.id;
	}

	var preInit = function(){
        $scope.current.group = {
            ExternalId : 0,
            Name : "",
            Description : "",
            Status : "",
            Thumbnail : "",
            Url:"",
            GroupType : "",
            Members:[]
        }

		var tasks = [];

		if($scope.current.id > 0){
			tasks.push(getGroupDetail($scope.current.id));
		}
  		$q.all([
			tasks
  		])
  		.then(init());
  	}
  	
	var init = function(){
		//$scope.showToast("Loaded", "");
	};
	$scope.showToast = function(msg, type) {
		var toast = $mdToast.simple()
			  .content(msg)
			  .action('OK')
			  .highlightAction(true)
			  .position('top');

		$mdToast.show(toast).then(function(response) {
		  if ( response == 'ok' ) {

		  }
		});
	};
	
	var getGroupDetail = function(id){
		return dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				//angular.copy(d.data.data,$scope.myGroups);  
				d.data.data.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.current.group = d.data.data[0];
			   	
			}
		});
	};
	
	$scope.save = function(){
		$scope.message = "";
		//blockUI()
		dataService.saveGroup($scope.current.group)
		.then(function(g){
			showToast("Group saved.");
		},
		function(e){
			$log.error(e);
		});
	}

	var getUsers = function(searchTerm){
		return dataService.getUsers(searchTerm).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				angular.copy(d.data.data,$scope.myGroups);  
				$scope.groupList.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			}
		});

	}
  	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
        	var baseUrl = config.apiBaseURL
            file.upload = Upload.upload({
                url: config.apiBaseUrl + '/v1/file/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    //file.result = response.data;
                    if(!response.data.isError){
                    	$scope.current.group.Thumbnail = response.data.url
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }
	}   

	preInit();
}]);