angular.module('cp').controller('mainController', function($scope, $log, storageService) {
  $scope.AUTHDATA = null;
  $scope.appOptions = {
    "showMenubar": true
    ,alerts: []
  };
  $scope.title = "-split-"
    //$scope.alerts = [];
  $scope.routeChange = function(tabName) {
    $scope.currentViewName = tabName;
  };
  $scope.addAlert = function(message, messageType) {
    if (messageType === undefined || messageType == "") {
      messageType = "default";
    }
    $scope.appOptions.alerts.push({
      msg: message,
      type: messageType
    });
  };

  $scope.closeAlert = function(index) {
    $scope.appOptions.alerts.splice(index, 1);
  };
  var init = function() {
    //TODO Check auth
    $scope.AUTHDATA = storageService.get('__splituser');
    
  }

  init();
  
});