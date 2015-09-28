angular.module('cp').controller('mainController', function($scope, $log) {
  $scope.currentTab = "events";
  $scope.appOptions = {
    "showMenubar": true
    ,alerts: []
  };
  $scope.title = "easyCollabourate"
    //$scope.alerts = [];
  $scope.routeChange = function(tabName) {
    $scope.currentTab = tabName;
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
    
  }
  init();
});