angular.module("cp")
.controller("resendPinCtrl", function($scope, $log, $state, storageService, dataService, authService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Resend pin";
  $scope.userModel = null;
  $scope.blockUI = false;
  $scope.pinModel = {
    mobileno:""
  };
  
  var init = function()
  {
    
    $scope.pinModel = {
      mobileno:""
    }
  }
  
  $scope.resendPin = function(){
    var model = {
        UserName: $scope.pinModel.mobileno
    };
    
    authService.resendPin(model).then(
      function(d){
        //toaster.pop('success', 'Activation code', 'You will shortly recieve the authentication via SMS.');
        var message = " Please enter your authorization code'";
        $log.info(d.data);
        storageService.add('user',model);
        storageService.add('status',"REQUESTED");
        $state.go("account.login");
      },
      function (e){
        $scope.addAlert(e.message, "danger");
        //toaster.pop('error', '', e.message);
      });
  }
  
  init();
});

