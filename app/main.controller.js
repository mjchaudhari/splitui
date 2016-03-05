angular.module('cp').controller('mainController', function($scope, $log, $state, storageService, authService, $repository, CacheFactory) {
  $scope.AUTHDATA = null;
  $scope.appOptions = {
    "showMenubar": true
    ,alerts: []
  };
  $scope._appName = "::collaborate"
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
  $scope.$on('evtLoggedIn',function(data) 
  { 
      $scope.AUTHDATA = storageService.get('__splituser');
      

  });

  
  $scope.$on('profileUpdated',function(data) 
  { 
      var user = storageService.set('__splituser', user);
      user.Picture = data.Picture;
      
      $scope.AUTHDATA = storageService.get('__splituser');

  });
  $scope.logoff = function(){
		authService.logOut().then(function(){
			$scope.AUTHDATA = null;
			storageService.remove();
			$state.go("home")
		});
  }
  $scope.editProfile = function(){
  	$state.go("account.profile");
  }
  $scope.refreshAllData = function(){
  	//clear groups from local storageService

	$repository.refreshGroups();  	
  }
  init();
  
});