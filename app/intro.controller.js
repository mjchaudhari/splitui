angular.module("cp")
.controller("introController", 
  function($scope, $log, $location, toaster, storageService, dataService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Introduction";
  $scope.initMessages = [];
  
});