(function() {
  
  var module ;
  try {
        module = angular.module('ezDirectives');;
    } catch (e) {
        module = angular.module('ezDirectives', ['ngFileUpload']);
    }
    
  this.ezTreeTemplate = [
    
    '<div>{{title}}' ,
        '<ul style="list-style-type:none;">',
          '<div ng-repeat="n in flatTree">',
            '<li  class="node" ng-if="!n.__isHidden"',
                'ng-class=" { \'node-selected\':n.__isSelected, \'node-unselected\': !n.__isSelected}">',
              '<div style="width:100%;">',
                '<span ng-style="{\'margin-left\': 20*n.__level}" >',
                  '<span ng-if="!n.__isExpanded"  >',
                    '<span ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="tree-toggler tree-toggler-right glyphicon glyphicon-chevron-right "></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="mdi-file-folder mdi-action-view-module glyphicon glyphicon-folder-open"></span>',
                  '</span>',
                  '<span ng-if="n.__isExpanded"  >',
                    '<span ng-click="toggleNodeVisibility(n,$event)" style="margine-right:2px;" class="tree-toggler tree-toggler-down glyphicon glyphicon-chevron-down"></span>',
                    '<span ng-click="toggleSelection(n,$event)" class="mdi-file-folder-open mdi-action-view-module glyphicon glyphicon-folder-close"></span>',
                  '</span>',
                '</span> ',
                //'<div style=" background-color:red;" ng-click="toggleSelection(n,$event)"> ',
                    '<span ng-click="toggleSelection(n,$event)">{{n.Name}} {{n.__level}}</span>',
                //'</div>',  
              '</div>',
            '</li>',
          '</div>',
        '</ul>',
        '',
      '</div>',
    ].join('\n');
    
  module.directive('ezTree', [
    '$timeout', function($timeout) {
      return {
        restrict: 'AE',
        template: this.ezTreeTemplate,
        replace: true,
        scope: {
          tree: '=',
          onSelect: '=',
          selectedNodes: '='
        },
        //controller start
        controller: ["$scope", function ($scope) {
          $scope.title = "Tree";
          var options = {
            idAttrib : "Id",
            nameAttrib :"Name",
            childrenAttrib : "Children"
          };
          
          var init = function(){
            
           $scope.flatTree = [];
           if($scope.tree){
               var dupNode = angular.copy($scope.tree);
               dupNode.__level = 0;
               dupNode.__isHidden = false;
               dupNode.__isExpanded = false;
               dupNode.__isSelected = true;
               dupNode[options.childrenAttrib] = null;
               
               $scope.flatTree.push(dupNode);
               var tree =  flattenTree($scope.tree); 
               var arr=$scope.flatTree.concat(tree);
               angular.copy(arr,$scope.flatTree);
               //expand first node
               expand(dupNode);
           }
          }
          
          
          //Make the flat array of the tree
          var flattenTree = function(node){
            var arr = [];
            if( node.__level === undefined)
                {
                  node.__level = 0;
                }
            if(node[options.childrenAttrib])
            {
              node[options.childrenAttrib].forEach(function(n){
                //make copy of this node because we are gng to remove the 
                //children and we do not want original tree to be affected.
                var nd = angular.copy(n);
                n.__level = node.__level + 1;
                nd.__isHidden = true;
                nd.__isExpanded = false;
                nd.__isSelected = false;
                nd.__parent = node.Id;
                nd.__level = n.__level;
                nd[options.childrenAttrib] = null;
                arr.push(nd);
                //Recursive find for children of current tree node.
                var retArr = flattenTree(n);
                arr = arr.concat(retArr);
              });
            }
            return arr;
          };
          
          $scope.toggleNodeVisibility = function(node,event)
          {
            //Logic: If we are collapsing the node, then we need to hide all nodes in nodes's hierarchy. 
            // But if we are expanding it we shold only make the children visible and no all hierarchy
            node.__isExpanded = !node.__isExpanded;
            var hide = !node.__isExpanded;
            var goTillLeaf= false;
            if (event.ctrlKey==1 || event.altKey == 1){
                // Use windows.location or your link.
                goTillLeaf = true;
            }
            //because hide is always till leaf
            if(hide)
            {
              goTillLeaf = true;
            }
            setChildrenVisibility(node,hide, goTillLeaf)
          };
          
          $scope.toggleSelection = function(node,event){
            var currentVal = node.__isSelected;
            
            if (event.ctrlKey!=1 && event.altKey != 1){
                //if in single selection mode a selected node is selected again then do not process further
                if(currentVal == true){
                  return;
                }
                unselectAll();
            }

            var selected = [];
            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node[options.idAttrib])
              {
                n.__isSelected = !currentVal;  
              }
              if(n.__isSelected){
                  selected.push(n);
              }
            });
              $scope.selectedNodes = selected;
              if($scope.onSelect)
              {
                  $scope.onSelect(node);
              }
          };
          var expand = function(node)
          {
                node.__isExpanded = true;
                node.__isHidden = false;
                //since th4 parent is expanded ensure all its children also visible
                var c = getChildren(node);
                c.forEach(function(chld){
                        chld.__isHidden =false;
                });
          }

          var expandTo = function(node){
            var parents = getParentTrail(node);
            node.__isHidden = false;
            parents.forEach(function(p){
                expand(p);
            });
          };

          var unselectAll = function()
          {
            $scope.flatTree.forEach(function(n){
                n.__isSelected = false;
              });
          }
          
          var setChildrenVisibility = function(node, isHidden, goTillLeaf)
          {
            var children = getChildren(node);
            if(!children)
            {
                return;
            }
            if(children.length < 0)
            {
                return;
            }
            children.forEach(function(n){
                n.__isHidden = isHidden;
                if(goTillLeaf)
                {
                  //check if we are going to open the children , if yes then this node must be expanded
                  node.__isExpanded = !isHidden;
                  setChildrenVisibility(n,isHidden,goTillLeaf);
                }
            });

            
          };
          //get children of this node
          var getChildren = function(node){
            var children = null;
            $scope.flatTree.forEach(function(n){
              if(n.__parent && n.__parent == node[options.idAttrib] ){

                  if(children == null){
                      children = [];
                  }
                  children.push(n);
              }
            });
            return children;
          };
            
          //get parent node 
          var getParent = function(node){
            var p = null;
            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node.__parent )
              {
                p=n;
              }
            });
            return p;
          };
          //get all predecessors of this node.
          var getParentTrail = function(node){
            var targetNode = null;

            $scope.flatTree.forEach(function(n){
              if(n[options.idAttrib] && n[options.idAttrib] == node[options.idAttrib])
              {
                targetNode=n;
              }
            });
            
            var parents = [];
            //find parents of the node
            var n = angular.copy(targetNode);
            var proceed = true;
            while(proceed){
                var p = getParent(n)

                if(p){
                    parents.push(p);
                    //now find parent of p;
                    n=angular.copy(p);
                }
                else{
                    proceed = false;
                }
            }
            return parents
          };

          $scope.$watch('tree', function(newValue, oldValue){
              if(newValue)
              {
                  init();
              }
          });
          
          $scope.$watch("selectedNodes", function (newValue, oldValue) {
            if (newValue) 
            {
                    //alert('selected changed');
              var ids =  [];
              for(var i=0;i<newValue.length;i++){
                      if(newValue[i][options.idAttrib])
                      {
                              var val = newValue[i][options.idAttrib];
                              if(val){
                                ids.push(val.toString());
                              }
                      }
              }
              
              if($scope.flatTree)
              {
                $scope.flatTree.forEach(function(n){
                        if(n[options.idAttrib])
                        {
                            var id = n[options.idAttrib].toString();
                            n.__isSelected = ids.indexOf(id) >= 0;
                            if(n.__isSelected){
                                expandTo(n);
                            }    
                        }                    
                });
              }
              
              if ($scope.selectionChanged)
              {
                  $scope.selectionChanged();
              }
            }
              
          });

          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
(function() {
  
  var module = null;
  try {
        module = angular.module('ezDirectives');;
    } catch (e) {
        module = angular.module('ezDirectives', []);
    }
  
  this.ezImageUploadTemplate = [
      '<md-card>',
        '<md-card-content layout="row" layout-align="space-between">',
          '<img ng-if="img != null" ng-src="{{img}}" style="border:4;align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="No image">',
          '<img ng-if="img == null" ng-src="{{defaultImage}}" style="border:4;align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="Default">',

          '<md-card-actions layout="column" layout-align="end center">',
            '<md-button class="md-primary md-raised md-icon-button accent" aria-label="Settings"',
             'ngf-select="uploadFiles($file, $invalidFiles)" accept="image/*" ngf-max-height="1000" ngf-max-size="1MB">',
              '<i class="material-icons">add_a_photo</i>',
            '</md-button>',

            '<md-button class="md-primary md-icon-button md-raised accent" aria-label="reset" ng-click="alert();resetImage()">',
              '<i class="material-icons">restore</i>',
            '</md-button>',
          '</md-card-actions>',
        '</md-card-content>',
      '</md-card>',


    
    ].join('\n');
    this.ezImageUploadTemplateNew = [
      '<md-card>',
        '<md-card-content layout="row" layout-align="space-between">',
          '<img ng-if="img != null" ng-src="{{img}}" style="border:4;align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="No image">',
          '<img ng-if="img == null" ng-src="{{defaultImage}}" style="border:4;align-self:center;height:auto; width:auto;max-height:150px; max-width:150px;" class="md-card-image" alt="Default">',

          '<md-card-actions layout="column" layout-align="end center">',
            '<md-button class="md-primary md-raised md-icon-button accent" aria-label="Settings"',
             'ngf-select="uploadFiles($file, $invalidFiles)" accept="image/*" ngf-max-height="1000" ngf-max-size="1MB">',
              '<i class="material-icons">add_a_photo</i>',
            '</md-button>',

            '<md-button class="md-primary md-icon-button md-raised accent" aria-label="reset" ng-click="alert();resetImage()">',
              '<i class="material-icons">restore</i>',
            '</md-button>',
          '</md-card-actions>',
        '</md-card-content>',
      '</md-card>',


    
    ].join('\n');
  module.directive('ezImageUpload', [
    '$timeout', function($timeout) {
      return {
        restrict: 'AE',
        template: this.ezImageUploadTemplate,
        replace: true,
        scope: {
          img: '=',
          defaultImage: "=?"
        },
        //controller start
        controller: ["$scope","Upload", function ($scope, Upload) {
          var originalImg = $scope.img;
          var img = undefined;
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
          
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends
(function() {
  
  var module ;
  try {
        module = angular.module('ezDirectives');;
    } catch (e) {
        module = angular.module('ezDirectives', []);
    }
    
  this.ezinitialsTemplate = [
//         '<span class="initials-circle" style="background: blueviolet;" >',
//             '<span style="color: whitesmoke;margin:0;">{{initials}}</span>',
//         '</span> ',
        '<div class="circle accent  md-title">{{initials}}</div>'
    ].join('\n');
    
  module.directive('ezInitials', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: this.ezinitialsTemplate,
        replace: true,
        scope: {
          text: '=',
        },
        //controller start
        controller: ["$scope", function ($scope) {
          $scope.initials = "";

          var init = function(){
            
            var matches = $scope.text.match(/\b(\w)/g);
            var inits = matches.join('');
            $scope.initials =  inits.substring(0,2);
          }
          
          $scope.$watch('text', function(newValue, oldValue){
              if(newValue)
              {
                  init();
              }
          });
          
          init();
          
        }]//controller ends
            
      }}
  ]);//directive ends  
    
    
    
})();//closure ends