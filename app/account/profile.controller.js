angular.module("cp")
.controller("profileController", function($scope, $log, $state, storageService, dataService, authService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Profile";
  $scope.registerModel = {};
  $scope.blockUI = false;
  $scope.defaultImage ="./content/images/profile-default.jpeg"
  var init = function(){
    var user = storageService.get('__splituser');
    if(user){
      $scope.registerModel._id = user._id;
      $scope.registerModel.fn = user.FirstName;
      $scope.registerModel.ln = user.LastName;
      $scope.registerModel.mobileno = user.UserName;
      $scope.registerModel.Thumbnail = user.Thumbnail;
    
    };
    if($scope.registerModel.Thumbnail == null || $scope.registerModel.Thumbnail == ""){
      $scope.registerModel.Thumbnail = $scope.defaultImage;
    }

  }

  $scope.saveProfile = function(){
    
    var model = {
        _id : $scope.registerModel._id 
      , FirstName: $scope.registerModel.fn
      , LastName: $scope.registerModel.ln
      , UserName: $scope.registerModel.mobileno
      
    };

    if($scope.registerModel.Thumbnail != $scope.defaultImage){
      model.Picture = $scope.registerModel.Thumbnail;
    }
    dataService.saveProfile(model).then(
      function(d){
        if(d.data.isError){

          return;
        }
        //toaster.pop('success', 'Registration successful', 'You will shortly recieve the authentication code via SMS.');
        var message = " Please enter your authorization code'";
        
        storageService.add('__splituser',model);
        $scope.$emit('profileUpdated', { data: d.data });
      },
      function (e){
        //$scope.addAlert(e.message,"danger");
        //toaster.pop('error', '', e.message);
      });
  }
  
  init();
});

