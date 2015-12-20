angular.module("cp")
.controller("groupsCtrl", function($scope, $log, $state, $stateParams, 
    storageService, dataService){
  $scope.currentViewName = "Groups";
  $scope.id = $stateParams.id;
  $scope.infoSlideOpen = false;
  $scope.groups = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.groupList = [];
  

  
  var init = function(){
    
    dataService.getGroups().then(function(d){
     if(d.data.isError){
        //toaster.pop("error","",d.Message)
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
    
  
  $scope.viewGroupInfo = function(node){
    
      $scope.selected.group = node;
      if($scope.selected.group){
        $scope.infoSlideOpen = true;
      }
  };
  
  $scope.editGroup = function(grp){
    if(grp){
      $state.go("index.editgroup", {id:grp.ExternalId});
    }
    else{
      $state.go("index.editgroup");
    }
      
  };

  $scope.openGroup = function(node){
    
      $scope.selected.parent = node;
      $state.go("index.group", {id:node.ExternalId});

  };
    
  init();  
});