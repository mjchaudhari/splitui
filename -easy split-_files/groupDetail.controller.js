angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', 'storageService', 'dataService',
function ($scope, $log, $q, $state, $stateParams,   storageService, dataService){
	$scope.$parent.currentViewName = "Group Detail" 
	
	$scope.current = {
		action:"View",
	    id:0,
	    group:{}
	};
	if($stateParams.id){
		$scope.current.id = $stateParams.id;
	}
	if($stateParams.view){
		$scope.current.action = $stateParams.action;
	}

	var preInit = function(){
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