angular.module("cp")
.controller("groupsCtrl", function($scope, $log, $state, $stateParams, 
    storageService, $repository, dataService, $timeout){
  $scope.currentViewName = "Groups";
  $scope.id = $stateParams.id;
  $scope.infoSlideOpen = false;
  $scope.groups = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.groupList = [];
  $scope.fabIsOpen = false;
  $scope.groupsLoading = false;
  $scope.assetsLoading = false;
  
  var init = function(){
    $scope.groupList = [];
    $scope.groupsLoading = true; 
    var g = $repository.groups;
    angular.copy(g,$scope.groupList);  
    
    if(g.length <=0){
      $repository.refreshGroups().then(function(){
        var g = $repository.groups;
        angular.copy(g,$scope.groupList);  

        $timeout($scope.refresh(),100);
        $scope.groupsLoading = false;
      },
      function(){
        $timeout($scope.refresh(),100);
        $scope.groupsLoading = false;

      });
    }
    else{
      $timeout($scope.refresh(),100);
      $scope.groupsLoading = false;
      
    }
//     dataService.getGroups().then(function(d){
//      if(d.data.isError){
//         //toaster.pop("error","",d.Message)
//       }
//       else{
//         angular.copy(d.data.data,$scope.groupList);  
//         $scope.groupList.forEach(function(obj){
              
//               obj.DateCreated = new Date(obj.DateCreated);
//          });
//       }
//       $scope.groupsLoading = false;
      
//     }, function(e){
//       //console.error(e);
//     });

  };
  var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  $scope.refresh = function(){
      $repository.refreshGroups().then(function(){
      angular.copy($repository.groups,$scope.groupList);  
      
    })
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