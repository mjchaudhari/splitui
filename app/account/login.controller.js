angular.module("cp")
.controller("loginCtrl", function($scope, $log, storageService, $state, toaster, dataService){
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
    var model = {
        UserName: $scope.authModel.userName
      , Secret: $scope.authModel.password
    };
    
    dataService.authenticate(model).then(
      function(d){
        toaster.pop('success', 'Authentiaction successful', 'You can start browsing the application now.');
        $log.info(d.data);
        storageService.add('__splituser',d.data.data);
        //storageService.add('__splitstatus',"REGISTERED");
        storageService.add('__splituserat',d.data.data.AccessToken);
        $state.go('index.groups');
      },
      function (e){
        toaster.pop('error', '', e.message);
        //$state.go('index');
      });
  }
  
  init();
});

