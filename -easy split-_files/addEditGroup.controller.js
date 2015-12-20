angular.module("cp").controller("addEditGroupCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', 'storageService', 'dataService',
function ($scope, $log, $q, $state, $stateParams,   storageService, dataService){
	$scope.$parent.currentViewName = "Edit Group";
	
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
  	

	preInit();
}]);