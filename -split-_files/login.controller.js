angular.module("cp")
.controller("loginCtrl", function($scope, $log, storageService, $state,$mdToast, authService, dataService){
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
        //toaster.pop('success', 'Authentiaction successful', 'You can start browsing the application now.');
        $state.go('index.groups');
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

