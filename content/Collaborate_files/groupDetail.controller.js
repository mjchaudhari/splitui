angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams','$timeout', 'storageService', 'dataService','$mdToast','$mdDialog',
function ($scope, $log, $q, $state, $stateParams, $timeout, storageService, dataService, $mdToast, $mdDialog){
	$scope.$parent.currentViewName = "Group Detail" 
	$scope.isLoading = false;
	$scope.isSaving = false;
	$scope.view = "list";
	$scope.lastUpdated = null;
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
	
	$scope.assets = [];
  	$scope.selectedTopic = null;


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
		var localRepo = storageService.get($scope.filter.groupId);
		if(localRepo == null){
		  localRepo = {
			"lastUpdated" : null,
			"list" : []
		  };
		}
		else if(localRepo.list == null){
		  localRepo.list = [];
		}

		var localAssets = localRepo.list;
		angular.copy(localAssets, $scope.assets);
		
		$timeout(getAssets(),100);
		
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
	
	var getAssets = function(){
		$scope.filter.from = lastUpdatedInLocalRepo();
		return dataService.getAssets($scope.filter)
		.then(function(d){
		  //append the local list
		  d.data.data.forEach(function(a){
		  	var existing  = _.findWhere($scope.assets, {"_id":a._id});
		  	if(existing){
		  		existing = a; //Reassign it its self as this asset might have been modified
		  	}
		  	else{
		  		$scope.assets.push(a)	
		  	}
			
		  });

		  //addd this to local storageService
		  var store = {
			"lastUpdated":new Date().toISOString(),
			"list":$scope.assets,
		  }

		  storageService.add($scope.filter.groupId,store);
		});
	};

	var lastUpdatedInLocalRepo = function(){
		var last =  new Date(2015,1,1);
		var localRepo = storageService.get($scope.filter.groupId);
		if(localRepo && localRepo.lastUpdated){
		  last = new Date(localRepo.lastUpdated).toISOString();
		  $scope.lastUpdated = last;
		}

		return last;
	}  

	$scope.refreshRepo = function(){    
		var lastUpdated = new Date(1,1,2015);
		storageService.add($scope.filter.groupId,{
		  "list":[],
		  "lastUpdated"  : lastUpdated,
		});
	}

	$scope.createAsset= function(){
		$scope.view = "item";

	}


	$scope.backToList= function(){
		$scope.view = "list";

	}
	$scope.refresh = function(){
		return getAssets();
	}
	$scope.hideSearch = function(){

		$scope.searchTerm = "";
		$scope.showSearch = false;
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
	$scope.openCategoryMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

	$scope.setCategory = function(category, ev) {
      originatorEv = ev;
      $scope.selectedCategory = category;
      
    };
	
	$scope.saveAsset = function() {
		$scope.isSaving = true;
		var isValid = validate();     
		dataService.saveAsset($scope.asset)
		.then(function(d){
			if(d.data.isError){
				$scope.showToast("Error occured,", "error");
			}
			else{
				updateLocalRepo(d.data.data);
				//getAssets();
				$scope.showToast("Created!", "success");
				
				//change to list view
				$scope.view = "list";

			}
			$scope.isSaving = false;
		}, function(e){
			$scope.showToast("Error occured,", "error");
			$scope.isSaving = false;
		}); 
    };
	var updateLocalRepo = function(asset){
		var localRepo = storageService.get($scope.filter.groupId);
		
		var localAsset = _.where(localRepo.list, {"_id":asset._id});
		
		if(localAsset == null){
			localAsset = asset;
		}else{
			localRepo.list.push(asset);
		}

		var localRepo = storageService.get($scope.filter.groupId);
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
//-------------------------------------
	$scope.height = "96px";
	$scope.width = "96px";
	$scope.uploadUrl = "";
	$scope.thumb = {
		sourceFile:'',
		croppedDataUrl:'',
		cropperMinSize : 80,
		resultSize : 100,
		cropperGuide : 'circle'
	}
	if($scope.thumbnail==""){
		$scope.thumbnail = "https://placehold.it/96x96"
	}
	$scope.openThumbnailDialog = function($event){
		var parentEl = angular.element(document.body);
	   $mdDialog.show({
		 parent: parentEl,
		 targetEvent: $event,
		 templateUrl:"thumbnailDialogTemplate.html",
		 locals: {
		   items: $scope.items
		 },
		 controller: DialogController
	  });
	  function DialogController($scope, $mdDialog, items, Upload) {
		$scope.items = items;
		$scope.sourceFile = "";
		$scope.openSelectFile = function(dataUrl ){
			console.info(dataUrl);
		}


		$scope.closeDialog = function() {
		  $mdDialog.hide();
		}



	  }
    }



	preInit();
}]);