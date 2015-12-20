angular.module("cp")
.controller("assetsListCtrl", function($scope, $log, $state, $stateParams, storageService, dataService){
  $scope.title = "Asset List";
  $scope.id = $stateParams.id;
  $scope.assetTree = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.selected.selectedNodes = [];
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
   
   $scope.$on('__treeFetched', function(event, args){
        $scope.assetTree = args.tree;
        
        //setTreeNode($scope.$parent.selected.parent.Id);
        var temp = {"Id":$scope.$parent.selected.parent.Id};
        $scope.selected.selectedNodes = [temp];
   });

  $scope.onNodeSelect = function(node){
    
      $scope.selected.parent = node;
      $scope.breadcrumb.push(node);
      $state.go("index.assets.list", {id:node.Id});
  };

    var setTreeNode = function(parentId)
    {var parentNode
        utils.treeWalker($scope.assetTree, function(n){
            n.isSelected = n.Id == parentId;
            if(n.Id == parentId)
            {
              parentNode = n;
            }
        })
        
        //ivhTreeviewMgr.expandTo($scope.assetTree,parentId, {},true);
            
    }

  init();  
});