angular.module("cp")
.controller("loginCtrl", function($scope, $log, storageService, $state, toaster, authService, dataService){
  $scope.title = "";
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
        toaster.pop('success', 'Authentiaction successful', 'You can start browsing the application now.');
        $state.go('index.groups');
      },
      function (e){
        if(e && e.isError && e.err){
          toaster.pop('error', 'Login failed', e.err);
        }
      });
  }
  
  init();
});

