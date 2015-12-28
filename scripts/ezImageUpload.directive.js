(function() {
  
  var module ;
  try {
        module = $injector.get('cp');
    } catch (e) {
        module = angular.module('ezDirectives', []);
    }
  
  this.template = [
      '<md-card>',
        
        '<img ng-if="img != null" ng-src="{{img}}" style="align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="No image">',
        '<img ng-if="img == null" ng-src="{{defaultImage}}" style="align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="Default">',

        '<md-card-actions layout="row" layout-align="end center">',
          '<md-button class="md-icon-button md-primary accent" aria-label="Settings"',
           'type="file" ngf-select="uploadFiles($file, $invalidFiles)" accept="image/*" ngf-capture="\'camera\'" ngf-max-height="1000" ngf-max-size="1MB"',
           '>',
            '<i class="material-icons">add_a_photo</i>',
          '</md-button>',

          '<md-button class="md-icon-button md-primary accent" aria-label="reset" ng-click="resetImage()">',
            '<i class="material-icons">restore</i>',
          '</md-button>',
        '</md-card-actions>',
      '</md-card>',

    
    ].join('\n');
    
  module.directive('ezImageUpload', [
    '$timeout', function($timeout) {
      return {
        restrict: 'AE',
        template: this.template,
        replace: true,
        scope: {
          img: '='
        },
        //controller start
        controller: ["$scope","Upload", function ($scope, Upload) {
          var originalImg = $scope.img;
          var img = undefined;
          $scope.defaultImage = "./content/images/group-default3.png";
          
          var init = function(){
            
          }
          
          $scope.resetImage = function(){
                  if(originalImg ){
                          $scope.img = originalImg;
                  }
                  else if(defaultImage)
                  {
                         $scope.img = defaultImage; 
                  }
          }
          $scope.uploadFiles = function(file, errFiles){
                
                if (file) {
                    var baseUrl = config.apiBaseURL
                    file.upload = Upload.upload({
                        url: config.apiBaseUrl + '/v1/file/upload',
                        data: {file: file}
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            //file.result = response.data;
                            if(!response.data.isError){
                                $scope.img = response.data.data.url;
                            }
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * 
                                                 evt.loaded / evt.total));
                    });
                }
          }

          $scope.$watch('img', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.img = newValue;
              }
          });
          
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends