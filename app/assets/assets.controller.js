angular.module("cp")
.controller("assetsCtrl", function($scope, $log, $stateParams, storageService, dataService){
  $scope.title = "Asset List"
  $scope.assetTree = null;
  $scope.breadcrumb = [];
  $scope.selected = {
    parent:null
  };
  
  $scope.actionsFabOpen = false;

  $scope.assets = [];
  $scope.selectedTopic = null;

  $scope.filter = {
    from:null,
    groupId:$stateParams.id,
    topicId:null,
    count:100,
  }
  var init = function(){

    var localRepo = storageService.get($scope.filter.groupId);

    if(localRepo && localRepo.list == null){
      localRepo.list = [];
    }

    var localAssets = _.where(localRepo.list, {"GroupId":$scope.filter.groupId});
    angular.copy(localAssets, $scope.assets);

    getAssets();
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
    var last = Date(1,1,2015);
    var localRepo = storageService.get($scope.filter.groupId);
    if(localRepo && localRepo.lastUpdated){
      last = Date(localRepo.lastUpdated);
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
  init();  
});