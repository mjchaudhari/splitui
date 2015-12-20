angular.module("cp")
.controller("registerController", function($scope, $log, $state, storageService, dataService, authService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Register";
  $scope.registerModel = {};
  $scope.blockUI = false;
  
  $scope.register = function(){
    
    
    var model = {
        FirstName: $scope.registerModel.fn
      , LastName: $scope.registerModel.ln
      , UserName: $scope.registerModel.mobileno
      , ClientKey: $scope.registerModel.clientId
    };
    
    authService.register(model).then(
      function(d){
        //toaster.pop('success', 'Registration successful', 'You will shortly recieve the authentication code via SMS.');
        var message = " Please enter your authorization code'";
        
        storageService.add('user',model);
        storageService.add('status',"REQUESTED");
        $state.go("account.login");
      },
      function (e){
        //$scope.addAlert(e.message,"danger");
        //toaster.pop('error', '', e.message);
      });
  }
  
});

