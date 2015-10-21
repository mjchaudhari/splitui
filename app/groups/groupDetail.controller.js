angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$state', '$stateParams', 'toaster', 'storageService', 'dataService',
function ($scope, $log, $state, $stateParams, toaster,   storageService, dataService){
	$scope.currentViewName = "Group Detail" 

	$scope.current = {
		action:"view",
	    id:0,
	    group:{}
	};
	if($stateParams.id){
		$scope.current.id = $stateParams.id;
	}
	if($stateParams.view){
		$scope.current.action = $stateParams.action;
	}
  
	var init = function(){

		dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				toaster.pop("error","",d.Message)
			}
			else{
				angular.copy(d.data.data,$scope.myGroups);  
				$scope.groupList.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
				   });
			}
		});
	};

	$scope.getGroups = function(){

	}

}]);