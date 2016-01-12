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
        $scope.$emit('evtLoggedIn', { data: d.data });
        $mdToast.show(
            $mdToast.simple()
              .content("Authenticated")
              .hideDelay(3000)
        );
        $timeout(function(){$state.go('index.groups');},1000);
        
      },
      function (e){
        if(e && e.data.isError && e.data.err){
          //toaster.pop('error', 'Login failed', e.err);
          $mdToast.show(
            $mdToast.simple()
              .content(e.data.err)
              //.position($scope.getToastPosition())
              .hideDelay(3000)
          );
        }
      });
  }
  
  init();
});

