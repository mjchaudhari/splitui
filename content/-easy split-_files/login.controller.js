angular.module("cp")
.controller("loginCtrl", function($scope, $log, $timeout, storageService, $state,$mdToast, authService, dataService){
  $scope.title = "-split-";
  $scope.userModel = null;

  $scope.authModel = {
    userName:"",
    password:""
  };
  
  var init = function()
  {
    $scope.authModel = {
      userName:"",
      password:""
    }
  }
  
  $scope.verify = function(){
    authService.login($scope.authModel.userName, $scope.authModel.password).then(
      function(d){
        $mdToast.show(
            $mdToast.simple()
              .content("Authenticated")
              .hideDelay(3000)
        );
        $timeout(function(){$state.go('index.groups');},1000);
        
      },
      function (e){
        if(e && e.isError && e.err){
          //toaster.pop('error', 'Login failed', e.err);
          $mdToast.show(
            $mdToast.simple()
              .content(e.message)
              //.position($scope.getToastPosition())
              .hideDelay(3000)
          );
        }
      });
  }
  
  init();
});

