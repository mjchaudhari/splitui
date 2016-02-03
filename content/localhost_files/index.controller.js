angular.module("cp").controller("indexCtrl", 
['$scope', '$log', '$state', '$stateParams', 'storageService', 'authService', '$mdSidenav', 'dataService',
function ($scope, $log, $state, $stateParams,   storageService, authService, $mdSidenav, dataService){
	$scope.currentViewName = "..." 
	$scope.myGroups = [];
  
	$scope.themes = ['default','light-blue','amber','cyan', 'yellow', 'light-green','lime'];
  	$scope.theme = storageService.get("theme") ;
	if($scope.theme == undefined){
		$scope.theme = 0;
	}

	var init = function(){

		dataService.getGroups().then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				angular.copy(d.data.data,$scope.myGroups);  
				$scope.myGroups.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
				   });
			}
		});
	};
	$scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'left'
      };

	//Set next theme
	$scope.nextTheme = function(){
		if(($scope.theme + 1) >= $scope.themes.length){
			$scope.theme = 0;
		}
		else{
			$scope.theme++;
		}
		
		storageService.add("theme",$scope.theme) ;	
		
		
	}
	$scope.toggleLeft = function(){
		return $mdSidenav('left')
          .toggle();
	}
	
	
	init();

}]);