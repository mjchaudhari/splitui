angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams','$timeout', '$repository', 'dataService','$mdToast','$mdDialog',
function ($scope, $log, $q, $state, $stateParams, $timeout, $repository, dataService, $mdToast, $mdDialog){
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

	$scope.createAsset= function(){
		$scope.view = "item";

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

	
	
//----------------------------------------------------------------------------------------------//
//				ASSET 
//----------------------------------------------------------------------------------------------//
	
	$scope.parent = $scope.current.id;
// 	if($stateParam.parent){

// 	}
	$scope.categories = [
		{"_id": "cat_Comment", "Name":"Comment", "icon" : "announcement"},
// 		{"_id": "cat_Event", "Name":"Event", "icon" : "event"},
// 		{"_id": "cat_Topic", "Name":"Topic", "icon" : "folder"},
// 		{"_id": "cat_Issue", "Name":"Issue", "icon" : "report_problem"},
// 		{"_id": "cat_Task", "Name":"Task", "icon" : "assignment"},
// 		{"_id": "cat_Questionnaire", "Name":"Questions", "icon" : "questionnaire"},
		
	]
	


	$scope.selectedCategory = $scope.categories[0];
	

	$scope.asset = {
		"CategoryId" : $scope.selectedCategory._id,
		"Name":"",
		"Description":"",
		"Thumbnail":"",
		"Urls":"",
		"GroupId":$scope.current.id,
		"ParentId":$scope.parent
	}
	$scope.uploadedFiles=null;
	
	$scope.openCategoryMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

	$scope.setCategory = function(category, ev) {
      originatorEv = ev;
      $scope.selectedCategory = category;
      
    };
	$scope.uploadThumb = function(){
		dataService.uploadThumbnail($scope.asset._id,$scope.asset.Thumbnail);
	}
	$scope.saveAsset = function() {
		$scope.isSaving = true;
		var isValid = validate();     
		saveAssetData()
		.then(function(d){
				$q.all([
					//saveThumbnail(d.data.data._id,$scope.asset.Thumbnail),
					saveAssetArtifact(d.data.data._id)
				])
				.then(function(){
					$scope.showToast("Created!", "success");	
					$scope.group = _.findWhere($repository.groups,{"_id":$scope.filter.groupId});			
					//change to list view
					$scope.view = "list";
					$scope.isSaving = false;
				});
			
			
			
		}, function(e){
			$scope.showToast("Error occured,", "error");
			$scope.isSaving = false;
		}); 
    };
    
    var saveAssetData = function() {
		$scope.isSaving = true;
		var isValid = validate();     
		var defered = $q.defer();
		$repository.saveAsset($scope.asset)
		.then(function(d){
			defered.resolve(d);
		}, function(e){
			defered.reject(e);
		});
		return defered.promise;
    };
    $scope.uploadThumb = function(){
    	saveThumbnail ("4JXamxmje", $scope.asset.Thumbnail);
    }
    var saveThumbnail = function(assetId,thumbnail){
    	var def;
    	if(isBase64DataUrl(thumbnail)){
    		def = $repository.saveAssetThumbnail(assetId,thumbnail);
    	}
    	else{
			var def =  $q.defer();
			$timeout(def.resolve(),10);
    	}
    	return def;
    }

    var saveAssetArtifact = function(assetId){
    	var def;
    	if($scope.uploadedFiles){
    		def = $repository.uploadFiles(assetId);
    	}
    	else{
			var def =  $q.defer();
			$timeout(def.resolve(),10);
    	}
    	return def;
    }
   
	var validate = function(){
		var isValid = true;
		if($scope.asset == null){
			isValid = false;
		}

		if($scope.asset.Name == "" && $scope.Description == ""){
			isValid = false;
		}
		return true;
	}
	var isBase64DataUrl = function(img){
		if(img && 
			img.indexOf("data:image/png;base64") > -1){
				return true;
		}
		return false;
	}

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
	preInit();
}]);