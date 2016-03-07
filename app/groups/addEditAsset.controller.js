angular.module("cp").controller("addEditAssetCtrl", 
['$scope', '$log', '$q','$timeout', '$repository', 'dataService','$mdToast','$mdDialog','$mdBottomSheet', 'localData',
function ($scope, $log, $q, $timeout, $repository, dataService, $mdToast,$mdDialog, $mdBottomSheet, localData ){
	$scope.$parent.currentViewName = "Edit Asset" 
	$scope.isLoading = false;
	$scope.isSaving = false;
	$scope.view = "list";
	
	$scope.current = {
	    _id:localData.assetId,    
	    groupId : localData.groupId,
	    parentId : localData.parentId
	};
	if(localData.parentId){
		$scope.current.parentId = localData.parentId;
	}
	
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
		"_id":$scope.current._id,
		"CategoryId" : $scope.selectedCategory._id,
		"Name":"",
		"Description":"",
		"Thumbnail":"",
		"Urls":"",
		"GroupId":$scope.current.groupId,
		"ParentId":$scope.current.parentId
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
					saveAssetArtifact(d.data.data._id)
				])
				.then(function(){
					$scope.showToast("Created!", "success");	
					//$scope.group = _.findWhere($repository.groups,{"_id":$scope.filter.groupId});			
					//change to list view
					//$scope.view = "list";
					$scope.isSaving = false;
					$mdBottomSheet.hide();
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
	
	$scope.cancelAddEdit = function($event){
		var confirm = $mdDialog.confirm()
          .title('Cancel operation')
          .textContent('Any unsaved data will be lost.')
          .targetEvent($event)
          .ok('Close')
          .cancel('Do not close');
		$mdDialog.show(confirm).then(function() {
		  $mdBottomSheet.hide();
		}, function() {
		  
		});

	}

	$scope.showToast = function(msg, type) {
		var toast = $mdToast.simple()
			  .content(msg)
			  .action('OK')
			  .highlightAction(true)
			  .position('top');

		$mdToast.show(toast).then(function(response) {
		  if ( response == 'ok' ) {
				$mdBottomSheet.hide();
		  }
		});
	};

}]);