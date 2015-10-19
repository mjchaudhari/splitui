angular.module("cp")
.controller("groupsCtrl", function($scope, $log, $state, $stateParams, toaster, 
    storageService, dataService){
  $scope.currentViewName = "Groups";
  $scope.id = $stateParams.id;
  $scope.groups = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.groupList = [];
  

  
  var init = function(){
    
    dataService.getGroups().then(function(d){
     if(d.data.isError){
        toaster.pop("error","",d.Message)
      }
      else{
        angular.copy(d.data.data,$scope.groupList);  
        $scope.groupList.forEach(function(obj){
              obj.DateCreated = new Date(obj.DateCreated);
           });
        
      }
      
    });

  };
  
  $scope.refresh = function(){
      angularGridInstance.gallery.refresh();
  } 
    
  $scope.createGroup = function(node){
    
      
  };

  $scope.openGroup = function(node){
    
      $scope.selected.parent = node;
      $scope.breadcrumb.push(node);
      $state.go("index.assets.list", {id:node.Id});
  };

    
  init();  
});