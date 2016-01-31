angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', 'storageService', 'dataService',
function ($scope, $log, $q, $state, $stateParams,   storageService, dataService){
	$scope.$parent.currentViewName = "Group Detail" 
	$scope.isLoading = false;
	
	$scope.current = {
		action:"View",
	    id:0,
	    
	};
	$scope.group = null;

	if($stateParams.id){
		$scope.current.id = $stateParams.id;
	}
	if($stateParams.view){
		$scope.current.action = $stateParams.action;
	}

	var preInit = function(){
		var tasks = [];
		$scope.isLoading = true;
  			
		if($scope.current.id != ''){
			tasks.push(getGroupDetail($scope.current.id));
		}
  		$q.all([
			tasks
  		])
  		.then(function(){

  			init()
  		});
  	}
  	
	var init = function(){
		
	};

	var getGroupDetail = function(id){
		$scope.isLoading = true;
		return dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				//angular.copy(d.data.data,$scope.myGroups);  
				d.data.data.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.group = d.data.data[0];
			   	
			}
		}).finally(function(){
			$scope.isLoading = false;
		});

	}
	
	var getGroupActivities = function(id){
		
		

	}
  	

	preInit();
}]);