angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams','$timeout', '$repository', 'dataService','$mdToast','$mdDialog','$mdBottomSheet',
function ($scope, $log, $q, $state, $stateParams, $timeout, $repository, dataService, $mdToast, $mdDialog, $mdBottomSheet){
	$scope.$parent.currentViewName = "Group Detail" 
	$scope.isLoading = false;
	$scope.isSaving = false;
	$scope.view = "list";
	$scope.current = {
		action:"View",
	    id:0,    
	};
	$scope.searchTerm = "";
	$scope.showSearch = false;

	$scope.group = null;

	$scope.filter = {
		from:null,
		groupId:$stateParams.id,
		topicId:null,
		count:100,
	}
	
	//$scope.assets = [];
  	$scope.selectedTopic = null;


	if($stateParams.id){
		$scope.current.id = $stateParams.id;
	}
	if($stateParams.view){
		$scope.current.action = $stateParams.action;
	}

	var preInit = function(){
		var tasks = [];
		//$scope.isLoading = true;
  			
		if($scope.current.id != ''){
			//tasks.push(getGroupDetail($scope.current.id));
		}
  		$q.all([
			tasks
  		])
  		.then(function(){
  			init()
  		});
  	}
  	
	var init = function(){
		//var localRepo = storageService.get($scope.filter.groupId);
		$scope.group = _.findWhere($repository.groups,{"_id":$scope.filter.groupId});
		//angular.copy($scope.group.list, $scope.assets);
		$timeout($scope.refresh(),100);
		
	};

	$scope.createAsset= function($event){
		//$scope.view = "item";
		$scope.alert = '';
		$mdBottomSheet.show({
		  template: '<md-bottom-sheet class="md-grid" layout="column">' +
		  				'<div ng-include="\'./views/groups/addEditAsset.html\'"></div>' +
					'</md-bottom-sheet>' ,
		  controller: 'addEditAssetCtrl',
		  clickOutsideToClose : false,
		  locals : {localData :{
		  	assetId:null,
		  	groupId:$stateParams.id,
		  	parentId : $stateParams.id
		  }},
		  targetEvent: $event
		}).then(function(data) {
		  
		});
	}

	$scope.backToList= function(){
		$scope.view = "list";

	}
	$scope.refresh = function(){
		return $repository.refreshGroup($scope.current.id);
	}

	$scope.hardRefresh = function(){
		$repository.refreshGroup($scope.current.id);
	}
	$scope.searchAssets = function(item){
		var t = $scope.searchTerm
		if(t == null){
			return true;
		}
		if(t == ""){
			return true;
		}

		var createdBy = "";
		if(angular.isArray(item.Audit)){
			var a = item.Audit[0];
			if(a.FirstName){
				createdBy += item.Audit[0].FirstName ;	
			}
			if(a.LastName){
				createdBy += item.Audit[0].LastName ;	
			}
		}

		return item.Name.indexOf(t) > -1 ||
				(item.Description && item.Description.indexOf(t)) ||	
				(createdBy != "" && createdBy.indexOf(t) > -1)
	}

	
	preInit();
}]);