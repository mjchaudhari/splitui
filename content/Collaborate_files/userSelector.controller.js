// angular.module("cp")
// .controller("userSelectorCtrl", 
var userSelectorCtrl = function($scope, $log, $q, $mdDialog, $timeout, storageService, dataService){
  $scope.showLoader = false;
  $scope.addedMembers = [];
  $scope.members = [];
  $scope.searchText = "";
  $scope.selectedUser = null;

  var preInit = function(){
      tasks = [];
      $q.all([
        $scope.getUsers("")
      ])
      .then(function(){
        $scope.ready = true;
        init()
      })
  };
  
  var init = function(){

  }

  $scope.getUsers = function(term){
    var defer = $q.defer();
    dataService.getUsers(term)
    .then(function(d){   
        defer.resolve(d.data.data);
    });
    return defer.promise;

  }
  $scope.addMember = function(item){
    var exist = false;
    $scope.members.forEach(function(u){
      if(u.UserName == item.UserName){
        exist = true;
      }
    });
    if(!exist){
      $scope.addedMembers.push (item);
    }

  } 
  var getGroupMembers = function(groupId){
    var defer = $q.defer();
    return dataService.getGroupMembers(groupId)
    .then(function(d){
        angular.copy(d.Data, members);
    });

    return defer.promise;
  }


  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.done = function(answer) {
    $scope.showLoader(answer);
  };

  
  preInit();  
  
}
//);
