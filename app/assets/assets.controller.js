angular.module("cp")
.controller("assetsCtrl", function($scope, $log, $stateParams, storageService, dataService){
  $scope.title = "Asset List"
  $scope.assetTree = null;
  $scope.breadcrumb = [];
  $scope.selected = {
    parent:null
  };
  
  var init = function(){

//     dataService.getAssets().then(function(d){
//         $scope.assetTree = d;
//         $scope.breadcrumb.push(d)
        
//         $scope.selected.parent = d;

//         var parentId = $stateParams.id;
//         if(parentId != undefined)
//         {
//           var p = searchTree(d, parentId);
//           if(p)
//           {
//             $scope.selected.parent = p;
//           }
//         }

//         $scope.$broadcast('__treeFetched', {tree:d});
//     })
  };
  
  var searchTree = function (tree,id)
  {
    var retVal =null;
    if(tree.Id == id)
    {
      retVal = tree;
    }
    if(retVal)
    {
      return retVal;
    }

    if(tree.Children)
    {
      tree.Children.forEach(function(n){
        retVal = searchTree(n,id);
        return retVal;
      })
    }
    return retVal;
  }

  
  init();  
});