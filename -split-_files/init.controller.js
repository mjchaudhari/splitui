angular.module("cp")
.controller("initController", function($scope, $log, $location, storageService, dataService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "initializing!!";
  $scope.initMessages = [];

  var init = function(){
    //check User in web storage
    var user = storageService.get("user");
    if(user === undefined)
    {
      //send for registration
      $location.path("/intro");
    }
    var status = storageService.get("status");
    switch (status) {
      //user is not yet sent request for access
      case 'UNREGISTERED':
        {
          $location.path("/intro");
        }
        break;
      //When user has Requested for access but not yet received activation code.
      case 'REQUESTED':
        {
          //User has to authenticate with authorization code
          $location.path("/verifypin");
        }
        break;
      //When user has input valid Activation code.
      case 'REGISTERED':
        {
          //User has to authenticate with authorization code
          $location.path("/home");
        }
        break;
      //When admin user accept the user for his group
      case 'ACCEPTED':  
        {
          //User has to authenticate with authorization code
          $location.path("/home");
        }
        break;
      default:
        {
          $location.path("/intro");
        }
    }
  }

  init();  
  
});