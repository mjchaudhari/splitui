(function() {
  
  var module = null;
  try {
        module = angular.module('ezDirectives');;
    } catch (e) {
        module = angular.module('ezDirectives', []);
    }
  
  this.ezImageUploadTemplate = [
        '<div class="thumbnail-card" layout="column" layout-align="center center">',
      '  <md-button class="md-icon-button" ng-click="openThumbnailDialog($event)">',
      '     <i class="material-icons">edit</i>',
      '  </md-button>',
      '  <img src ng-src="{{thumbnail}}" class="md-avatar" md-click="openThumbnailDialog($event)" /> ',
      '</div>'  
    ].join('\n');

    
    this.ezImageUploadModalTemplate = [
       
          '<md-dialog flex="100" style="height:100vh" aria-label="List dialog">',
             '<md-dialog-content>',
                '<md-toolbar md-scroll-shrink="false">',
                  '<div class="md-toolbar-tools">',
                      '<md-button class="md-icon-button" ng-click="closeDialog()"  aria-label="close">',
                        '<ng-md-icon icon="cancel"></ng-md-icon> ',
                      '</md-button>',
                      '<span flex>{{title}}</span>',
                      '<div ng-show="uploading" class="" layout="row" layout-align="end">',
                          '<img style="height:40px;width:40px" class="rotating" src="./content/images/cp.png" />',
                      '</div>',
                      '<md-button class="md-icon-button" ng-click="closeDialog()"  aria-label="close">',
                        '<ng-md-icon icon="save"></ng-md-icon> ',
                      '</md-button>',
                  '</div>',
                '</md-toolbar>',
                '<div layout-padding>',
                  '<md-switch ng-model="thumb.cropperGuide" aria-label="Use circular cropper area:" ng-true-value=""""circle""" ng-false-value="""square""" class="md-warn">',
                       'Use square cropper area',
                  '</md-switch>',
                  '<div layout="column" layout-align="center center" class="crop-area md-whiteframe-1dp">',
                      '<ng-md-icon icon="camera_alt" size="64" ngf-select ng-model="thumb.sourceFile" accept="image/*"></ng-md-icon> ',
                      '<img-crop image="thumb.sourceFile | ngfDataUrl" area-type="{{thumb.cropperGuide}}"',
                      '    area-min-size="thumb.cropperMinSize" result-image-size="thumb.resusdfsdfsfltSize" ',
                      '    result-image="thumb.croppedDataUrl" >',
                      '</img-crop>',
                  '</div>',
              '</div>',
             '</md-dialog-content>',
         '</md-dialog>',
    ].join('\n');

    
  module.directive('ezImageUpload', ['$timeout', 
    function($timeout) {
      return {
        restrict: 'AE',
        template: this.ezImageUploadTemplate,
        replace: true,
        scope: {
          img: '=',
          defaultImage: "=?"
        },
        //controller start
        controller: ["$scope","Upload",'$mdDialog', function ($scope, Upload,$mdDialog) {
          var originalImg = $scope.img;
          var thumb = {
              croppedDataUrl:'',
              sourceFile:'',
              croppedDataUrl:'',
              cropperMinSize : 80,
              resultSize : 100,
              cropperGuide : 'circle'
          }
          //$scope.defaultImage = "./content/images/group-default3.png";
          
          var init = function(){
            
          }
          
          $scope.resetImage = function(){
              if(originalImg ){
                      $scope.img = originalImg;
              }
              else if($scope.defaultImage)
              {
                     $scope.img = $scope.defaultImage; 
              }
          }
          $scope.uploadFiles = function(file, errFiles){
                
              if (file) {
                  var baseUrl = config.apiBaseURL
                  file.upload = Upload.upload({
                      url: config.apiBaseUrl + '/v1/file',
                      data: {file: file}
                  });

                  file.upload.then(function (response) {
                      $timeout(function () {
                          //file.result = response.data;
                          if(!response.data.isError){
                              $scope.img = response.data.url;
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
          $scope.$watch('defaultImage', function(newValue, oldValue){
              if(newValue)
              {
                  $scope.defaultImage = newValue;
              }
              else{
                $scope.defaultImage = "https://placehold.it/100x100";
              }
          });
          
          $scope.openThumbnailDialog = function($event){
               var parentEl = angular.element(document.body);
               $mdDialog.show({
                 parent: parentEl,
                 targetEvent: $event,
                 template:ezImageUploadModalTemplate,
                 locals: {
                   items: $scope.items
                 },
                 controller: DialogController
              });
              function DialogController($scope, $mdDialog, items, Upload) {
                $scope.items = items;
                $scope.sourceFile = "";
                $scope.openSelectFile = function(dataUrl ){
                    console.info(dataUrl);
                }


                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }



              }
          }

          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends