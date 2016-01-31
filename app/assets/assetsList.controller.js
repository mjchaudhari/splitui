angular.module("cp")
.controller("assetsListCtrl", function($scope, $log, $state, $stateParams, storageService, dataService){
  
  $scope.id = $stateParams.id;
  $scope.selected = {};
  $scope.assetList = [];
  

  
  var init = function(){
    
    dataService.getChildren($scope.id).then(function(d){
      angular.copy(d,$scope.assetList);
    });

    if($scope.assetTree)
    {
        //setTreeNode($scope.id);
        //$scope.selected.selectedNodes = [];
        var temp = {"Id":$scope.id};
        $scope.selected.selectedNodes = [temp];
    }
  };
   
  init();  
});