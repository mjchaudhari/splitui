angular.module("cp")
.controller("introController", 
  function($scope, $log, $location, storageService, dataService, authService, $state){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Introduction";
  $scope.initMessages = [];
  $scope.revelView = false;

  //If we have the accesstoken and the user infor in webstorage then directly fetch groups
  var init = function(){
    var authData = storageService.get('__splituser');
    if(authData != null){
      var token = storageService.get('__splituserat');
      if(token != null){
        $state.go('index.groups');
      }
      else{
        $scope.revelView = true;
      }
    }
    else{
        $scope.revelView = true;
      }
  }

  init();
  
});