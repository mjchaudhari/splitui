angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams','$timeout', 'storageService', 'dataService','$mdToast',
function ($scope, $log, $q, $state, $stateParams, $timeout, storageService, dataService, $mdToast){
	$scope.$parent.currentViewName = "Group Detail" 
	$scope.isLoading = false;
	$scope.isSaving = false;
	$scope.view = "list";
	$scope.current = {
		action:"View",
	    id:0,    
	};

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
		dataService.getAssets($scope.filter)
		.then(function(d){
		  //append the local list
		  d.data.data.forEach(function(a){
			$scope.assets.push(a)
		  });

		  //addd this to local storageService
		  var store = {
			"lastUpdated":new Date(),
			"list":$scope.assets,
		  }

		  storageService.add($scope.filter.groupId,store);
		});
	};

	var lastUpdatedInLocalRepo = function(){
		var last =  new Date(2015,1,1);
		var localRepo = storageService.get($scope.filter.groupId);
		if(localRepo && localRepo.lastUpdated){
		  last = new Date(localRepo.lastUpdated);
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
				updateLocalRepo(d.data);
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

	preInit();
}]);