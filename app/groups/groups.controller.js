angular.module("cp")
.controller("groupsCtrl", function($scope, $log, $state, $stateParams, 
    storageService, dataService){
  $scope.currentViewName = "Groups";
  $scope.id = $stateParams.id;
  $scope.infoSlideOpen = false;
  $scope.groups = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.groupList = [];
  $scope.fabIsOpen = false;

  
  var init = function(){
    $scope.groupList = [];
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
  var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
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
      $state.go("index.editgroup", {id:grp._id});
    }
    else{
      $state.go("index.editgroup");
    }
      
  };
  
  $scope.openGroup = function(node){
    
      $scope.selected.parent = node;
      $state.go("index.group", {id:node._id});

  };
    
  init();  
});