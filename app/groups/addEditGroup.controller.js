angular.module("cp").controller("addEditGroupCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', '$mdToast', 'storageService','$timeout', 'Upload', 'dataService', '$mdMedia','$mdDialog','$window',
function ($scope, $log, $q, $state, $stateParams, $mdToast,  storageService, $timeout, Upload, dataService,$mdMedia, $mdDialog, $window){
	$scope.$parent.currentViewName = "Edit Group";
	$scope.defaultImage = "./content/images/group-default3.png"
	$scope.toastPosition = 'top';
	$scope.message = "";
    $scope.currentView = "main";
	$scope.current = {
		action:"Create",
	    id:0,
	    group:{}
	};
	
	/*Add participants*/
	$scope.members = [];
	$scope.searchText = "";
	$scope.selectedUser = null;

	var preInit = function(){
        $scope.current.group = {
            Id : 0,
            Name : "",
            Description : "",
            Status : "",
            Thumbnail : null,
            Url:"",
            GroupType : "",
            Members:[]
        }
		if($stateParams.id != 0)
		{
			$scope.current.group._id = $stateParams.id;
			$scope.$parent.currentViewName = "Create Group" ;
		}
		
		var tasks = [];

		if($scope.current.group._id && $scope.current.group._id != 0){
			tasks.push(getGroupDetail($scope.current.group._id));
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
					//obj.Id = obj._id;
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.current.group = d.data.data[0];
			   	
			}
		});
	};
	
	$scope.save = function(){
		$scope.message = "";
		//blockUI()
		//$scope.current.group._id = $scope.current.group.Id; 
		dataService.saveGroup($scope.current.group)
		.then(function(g){
			$scope.showToast("Group saved.");
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

	$scope.removeMember = function (item){
		var data = 
		{
			"groupId":$scope.current.group._id,
			"members":[item._id]
		}
		dataService.removeGroupMembers(data).then(function(d){
			if(d.isError){
				$scope.showToast("Failed to add member", "");	
			}
			else{

				var index = _.indexOf(_.pluck($scope.current.group.Members, '_id'), item._id);
				$scope.current.group.Members.splice(index,1);			
			}
		});

	}

	$scope.addMember = function (){
		var exist = false;
		$scope.current.group.Members.forEach(function(u){
		  if(u.UserName == $scope.selectedUser.UserName){
			exist = true;
		  }
		});
		if(!exist){
			var data = 
			{
				"groupId":$scope.current.group._id,
				"members":[$scope.selectedUser._id]
			}
			dataService.addGroupMembers(data).then(function(d){
				if(d.isError){
					$scope.showToast("Failed to add member", "");	
				}
				else{
					$scope.current.group.Members.push($scope.selectedUser);			
				}
			});
		}
	}

	$scope.getUsers = function(term){
		var defer = $q.defer();
		dataService.getUsers(term)
		.then(function(d){   
			defer.resolve(d.data.data);
		});
		return defer.promise;
	}


	$scope.cancel =function(){
		//take back to list of groups
		$window.history.back();
	}
    $scope.showAddMembers = function(){
        $scope.currentView = "members"
    }
    $scope.cancelMemberAdd = function(){
        $scope.currentView = "main"
    }
	preInit();
}]);
