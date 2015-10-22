angular.module("cp").controller("indexCtrl", 
['$scope', '$log', '$state', '$stateParams', 'toaster', 'storageService', 'authService', 'dataService',
function ($scope, $log, $state, $stateParams, toaster,   storageService, authService, dataService){
	$scope.currentViewName = "..." 
	$scope.myGroups = [];
  
	
  
	var init = function(){

		dataService.getGroups().then(function(d){
			if(d.data.isError){
				toaster.pop("error","",d.Message)
			}
			else{
				angular.copy(d.data.data,$scope.myGroups);  
				$scope.myGroups.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
				   });
			}
		});
	};

	$scope.logoff = function(){
		authService.logOut().then(function(){
			$state.go("home")
		});
	}
	init();

}]);