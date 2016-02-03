this.config = {
  apiBaseUrl : "https://ezco.azurewebsites.net"  // "https://splitapi-mjchaudhari-1.c9.io" //"
  //apiBaseUrl :  "http://localhost:8085" ,
}

this.utils = {

  /**
  * Walk through each node of the tree
  *
  * `node` may be either an actual tree node object which is being traversed
  *
  * `finNodeHandler(node,parent)` function which is called when not in found during tree traversal with params node and its parent
  *          
  * `opts` options describing the ChindrenNode property of the node`.
  *
  * @param {Object|Array} node The tree node whcich has be iterated traversed
  * @param {Object|String} method which will be invoked when node is found .
  * @param {Object} opts [optional] describing the ChindrenNode property of the node`.
     * @param {opts.parent} parent node [optional]  the current node (if any)
  * @return {Object} Returns the ivhTreeviewMgr instance for chaining
  */
  treeWalker: function (node, findNodeHandler, opt) {
      var childrenAttribute = "Children";
      if (opt) {
          if (opt.childrenAttribute && opt.childrenAttribute != "") {
              childrenAttribute = opt.childrenAttribute;
          }
      }

      if (findNodeHandler) {
          findNodeHandler(node, parent);
      }
      if (node[childrenAttribute]) {
          for (var i = 0; i < node[childrenAttribute].length; i++) {
              if (opt == undefined) {
                  opt = {}
                  opt.parent = node;
              }
              utils.treeWalker(node[childrenAttribute][i], findNodeHandler, opt);
          }
      }

  },

  /**
   * Get the Path of given node 
   *
   * `opts` will default to an empty object, `isSelected` defaults to `true`.
   *
   * @param {Object|Array} node The tree node
   * @return {Array} Returns the array of parents
   */
  getTreeNodePath: function (tree, node, opt) {
      var childrenAttribute = "Children";
      if (opt) {
          if (opt.childrenAttribute && opt.childrenAttribute != "") {
              childrenAttribute = opt.childrenAttribute;
          }
      }

      var flatNodes = [];
      utils.treeWalker(tree, function (node) {
          flatNodes.push(node);
      });

      var result = [];
      var n = _.findWhere(flatNodes, { "Id": node.Id });
      result.push(n);
      //find the nodes which containt this node
      var findParentNode = function (nodeToFind) {
          for (var i = 0; i < flatNodes.length; i++) {
              var parent = flatNodes[i];
              if (parent[childrenAttribute]) {
                  var foundParent = _.findWhere(parent[childrenAttribute], { "Id": nodeToFind.Id });
                  if (foundParent) {
                      var p = foundParent[0];
                      result.push(parent);
                      findParentNode(parent);
                  }
              }
          }
      };

      findParentNode(node);
      return result.reverse();
  }
}
/// <reference path="../typings/angularjs/angular.d.ts"/>
// Code goes here
 //module = angular.module('ezDirectives', ['ngFileUpload']);
 var app = angular.module('cp', ['ngMaterial','ngMdIcons', 'ngAnimate', 'ngSanitize', 'ui.router',
      ,'ngStorage','ngFileUpload', 'ezDirectives','angular-cache','ngImgCrop',]);
 
 app.config([ "$httpProvider","$urlRouterProvider", '$stateProvider','$mdThemingProvider', 'CacheFactoryProvider',
 function($httpProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, CacheFactoryProvider ){
   
   angular.extend(CacheFactoryProvider.defaults, { maxAge: 1 * 60 * 1000 });

//    $mdThemingProvider.theme('default')
//     .primaryPalette('blue-grey')
//     .accentPalette('amber');
    $mdThemingProvider.theme('default')
    .primaryPalette('purple')
    
   $mdThemingProvider.theme('light-blue')
    .primaryPalette('light-blue')
    .accentPalette('red');

   $mdThemingProvider.theme('light-blue')
    .primaryPalette('light-blue')
    .accentPalette('red');

   $mdThemingProvider.theme('amber')
    .primaryPalette('amber')
    .accentPalette('red');

   $mdThemingProvider.theme('cyan')
    .primaryPalette('cyan')
    .accentPalette('red');

   $mdThemingProvider.theme('dark-blue')
    .primaryPalette('yellow')
    .accentPalette('red');
//light-green
   $mdThemingProvider.theme('light-green')
    .primaryPalette('light-green')
    .accentPalette('red');
//lime
      $mdThemingProvider.theme('lime')
          .primaryPalette('lime')
          .accentPalette('pink');
         
         $mdThemingProvider.alwaysWatchTheme(true);
   $httpProvider.interceptors.push('httpInterceptor');
   
   $urlRouterProvider.otherwise("/");
   
   $stateProvider
      .state("home", {url:"/", templateUrl : "/views/intro.html"})      
      .state("intro", {url:"/intro", templateUrl : "/views/intro.html"})
      //Account
      .state("account",{url:"/account", templateUrl:"/views/account/index.html"}) 
      .state("account.login",{url:"/login", templateUrl:"/views/account/login.html"}) 
      .state("account.register",{url:"/register", templateUrl:"/views/account/register.html"}) 
      .state("account.registrationSuccess",{url:"/registrationSuccess", templateUrl:"/views/account/registrationSuccess.html"}) 
      
      .state('account.resendpin',{url:"/resendpin", templateUrl: 'views/account/resendPin.html'})

      .state('help',{url:"/help", templateUrl: '/views/help.html'})
      //Index routes
      .state('index',{url:"/index", templateUrl: '/views/index.html'})
      .state('index.dashboard',{url:"/dashboard", templateUrl: '/views/dashboard.html'})
      .state('index.groups',{url:"/groups", templateUrl: '/views/groups/groups.html'})
      .state('index.editgroup',{url:"/group/e/:id?", templateUrl: '/views/groups/addEditGroup.html'})
      .state('index.group',{url:"/group/v/:id", templateUrl: '/views/groups/GroupDetail.html'})
      ;
      
       
      // .state('index',{ url:"/index", templateUrl: 'views/index.html'})
      // .state('index.assets',{url:"/assets", templateUrl: 'views/assets.html'})
      // .state('index.notifications',{url:"/notifications",templateUrl: 'views/notifications.html'})
      // .state('index.events',{url:"/events",templateUrl: 'views/events.html'})
      // 
      // .state('auth',{url:"/auth",templateUrl: 'views/auth.html'})
      // .state('auth.resendpin',{url:"/resendpin", templateUrl: 'views/account/resendPin.html'})
      // .state('auth.changePassword', {url:"/changePassword", templateUrl: 'views/account/register.html'})
      // .state('auth.login',{url:"/login", templateUrl : 'views/account/verifypin.html'});
      
 }]);
 //Initialize state provider here.
 app.run(['$state', function ($state) {
   //hook the httpintercepter here so that it will add the token in each request
   //$httpProvider.interceptors.push('httpInterceptor');
       
 }]);
 

/*
  Storage should store all data in main wrapper object with name cp-data.
  Ideal structure
  cp-api = {
    [key:value]
  }
  
  e.g.
  cp-api = {
      user:{FirstName: abc, 
      LastName : 'xyz', 
      AccessToken:'asdf-asd-afdgdg-', 
      dp:"asdf/asdf/asf"
      Status: "REGISTERED"
    }
  }
*/

angular.module('cp').factory('storageService', 
function($q, $log, $localStorage){
  if($localStorage["cp-data"] === undefined)
      {
        $localStorage["cp-data"] = {};  
  }
  
  return {
    apiPrefix : config.apiBaseURL,  
    appName : "cp-data",
    add : function(key, val)
    {
      
      
      if($localStorage["cp-data"][key] === undefined)
      {
        $localStorage["cp-data"][key] = {};  
      }
      $localStorage["cp-data"][key] = val;
    },
    
    get : function(key)
    {
      return $localStorage["cp-data"][key];
    },
    
    remove : function(key)
    {
      if($localStorage["cp-data"][key] != undefined)
      {
        $localStorage["cp-data"][key] = undefined;  
      }

    }
    
  };
});
angular.module('cp').factory('dataService', 
function($http,$q, $log, $timeout, CacheFactory){
  if (!CacheFactory.get('dataServiceCache')) {
      
      CacheFactory.createCache('dataServiceCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 1 * 60 * 1000
      });
    }

    var dataServiceCache = CacheFactory.get('dataServiceCache');
    var requestOpts = {cache: dataServiceCache};
    
  return {
    apiPrefix : config.apiBaseUrl,  
    clearCache:function(){
      CacheFactory.clearAll();
    },
    getUser : function( ){
      
    },
    
    getUsers : function(searchTerm ){
      if(searchTerm)
      {
        return $http.get(this.apiPrefix + "/v1/user/search" + "?term=" + searchTerm, requestOpts);
      }
      else
      {
        return $http.get(this.apiPrefix + "/v1/user/search", requestOpts);
      }
    },
    
    getGroups : function(){
      var defered = $q.defer();
      var url = config.apiBaseUrl + "/v1/groups?status=active";
      $http.get(url, requestOpts)
      .then(function(d){
        defered.resolve(d);
      }, function(e){
        defered.reject(e);
      });
      return defered.promise;
    },
    getGroup : function(id){
      
      var url = config.apiBaseUrl + "/v1/groups?_id="+id;
      return $http.get(url, requestOpts);
    },
    saveGroup : function(grp){
      
      var url = config.apiBaseUrl + "/v1/group";
      return $http.post(url, grp);
    },
    getGroupMembers : function(id){
      
      var url = config.apiBaseUrl + "/v1/group/members?groupid="+id;
      return $http.get(url, requestOpts);
    },
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    addGroupMembers : function(data){
      
      var url = config.apiBaseUrl + "/v1/group/members";
      return $http.post(url, data);
    },
    
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    removeGroupMembers : function(data){
      
      var url = config.apiBaseUrl + "/v1/group/members/remove";
      return $http.post(url, data);
    },

    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    getAssets : function(filter){
      var qryString = "";

      if(filter.parentId)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="parentId="+filter.parentId
      }
      if(filter.count)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="count="+filter.count
      }
      if(filter.from)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="from="+filter.from
      }

      var url = config.apiBaseUrl + "/v1/"+ filter.groupId +"/assets";
      if(qryString.length > 0){
        url+="?"+qryString;
      }
      return $http.get(url);
    },

    saveAsset : function(data){
      var url = config.apiBaseUrl + "/v1/asset";
      return $http.post(url,data);
    },

  };
});

angular.module('cp').factory('authService', ['$http','$log','$q', 'storageService', 'CacheFactory','dataService',
	function ($http, $log, $q, storageService, CacheFactory,dataService) {

    var authServiceFactory = {};

    var _UserDetail = {
    };
	/**
    Register yourself
    */
    var _register = function( registerModel){
      var url = config.apiBaseUrl + "/v1/user";
      
      return $http.post(url, registerModel);
    }
    
    var _resendPin = function( data){
      var url = config.apiBaseUrl + "/v1/pin/resend";
      return $http.post(url, data);
    }
    var _login = function (userName, password) {
        var deferred = $q.defer();
        var model = {
            UserName: userName
            , Secret: password
        };
        var url = config.apiBaseUrl + "/v1/authenticate";
        $http.post(url, model).then(
        function(d){
        	dataService.clearCache();
            storageService.add('__splituser',d.data.data);
            storageService.add('__splituserat',d.data.data.AccessToken);
            deferred.resolve(d.data.data);
        },
        function (e){
            _logOut();
              deferred.reject(e);
          });
        return deferred.promise;
    };
     
    var _logOut = function () {
    	var deferred = $q.defer();
    	$q.all(
			storageService.remove('__splituser'),
			storageService.remove('__splituserat')

    	).then(function(){
    		dataService.clearCache();
    		deferred.resolve();
    	});
		return deferred.promise;
    };

    var _isAuthenticated = function () {
        var url = config.apiBaseUrl + "/v1/isauthenticated";
        return $http.post(url, model)
    };

    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.isAuthenticated = _isAuthenticated;
    authServiceFactory.UserDetail = _UserDetail;
    authServiceFactory.resendPin = _resendPin;
    authServiceFactory.register = _register;


    return authServiceFactory;
}])



'use strict';

angular.module('cp').factory('httpInterceptor', ['$q', '$location', '$injector', 'storageService','$log',
function ($q, $location, $injector , storageService, $log) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        if (config.url.search('authenticate') == -1 && config.url.search('resend')=='-1') {
                                
            config.headers = config.headers || {};

            var authData = storageService.get('__splituserat');
            if (authData) {
                
                config.headers.Authorization = 'Bearer ' + authData;
            }
        }
        return config;
    }

    // On request failure
    var _requestError= function (rejection) {
        return $q.reject(rejection);
    }

    // On response success
    var _response= function (response) {
        return response || $q.when(response);
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            if ($location.$$path.indexOf("login") <= -1  )
            {
                $log.info('Unauthenticated...redirecting to login page.');
                $injector.get('$state').go("account.login");
            }
        }
        else {
            
            //$log.error('Status: ' + rejection.status + ' , Message: ' + rejection.statusText);
            //$log.debug( 'Response Error: - ' + JSON.stringify(rejection));
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.requestError = _requestError;
    authInterceptorServiceFactory.response = _response;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
angular.module('cp').controller('mainController', function($scope, $log, $state, storageService, authService, CacheFactory) {
  $scope.AUTHDATA = null;
  $scope.appOptions = {
    "showMenubar": true
    ,alerts: []
  };
  $scope._appName = "::collaborate"
    //$scope.alerts = [];
  $scope.routeChange = function(tabName) {
    $scope.currentViewName = tabName;
  };
  $scope.addAlert = function(message, messageType) {
    if (messageType === undefined || messageType == "") {
      messageType = "default";
    }
    $scope.appOptions.alerts.push({
      msg: message,
      type: messageType
    });
  };

  $scope.closeAlert = function(index) {
    $scope.appOptions.alerts.splice(index, 1);
  };
  var init = function() {
    //TODO Check auth
    $scope.AUTHDATA = storageService.get('__splituser');
    
  }
  $scope.$on('evtLoggedIn',function(data) 
  { 
      $scope.AUTHDATA = storageService.get('__splituser');
      

  });
  $scope.logoff = function(){
		authService.logOut().then(function(){
			$scope.AUTHDATA = null;
	
			$state.go("home")
		});
  }
  init();
  
});
angular.module("cp")
.controller("homeController", function($scope, $log, $location, storageService, dataService){
  $scope.appOptions.showMenubar = true;
  var init = function(){
  };
  init();  
  
});


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
angular.module("cp")
.controller("introController", 
  function($scope, $log, $location, storageService, dataService, authService, $state){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Introduction";
  $scope.initMessages = [];
  $scope.revelView = false;

  //If we have the accesstoken and the user infor in webstorage then directly fetch groups
  var init = function(){
    var authData = storageService.get('__splituser');
    if(authData != null){
      var token = storageService.get('__splituserat');
      if(token != null){
        $state.go('index.groups');
      }
      else{
        $scope.revelView = true;
      }
    }
    else{
        $scope.revelView = true;
      }
  }

  init();
  
});
angular.module("cp")
.controller("loginCtrl", function($scope, $log, $timeout, storageService, $state,$mdToast, authService, dataService){
  $scope.title = ":: collaborate";
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
        $scope.$emit('evtLoggedIn', { data: d.data });
        $mdToast.show(
            $mdToast.simple()
              .content("Authenticated")
              .hideDelay(3000)
        );
        dataService.clearCache();
        $timeout(function(){$state.go('index.groups');},1000);
        
      },
      function (e){
        if(e && e.data.isError && e.data.err){
          //toaster.pop('error', 'Login failed', e.err);
          $mdToast.show(
            $mdToast.simple()
              .content(e.data.err)
              //.position($scope.getToastPosition())
              .hideDelay(3000)
          );
        }
      });
  }
  
  init();
});


angular.module("cp")
.controller("registerController", function($scope, $log, $state, storageService, dataService, authService){
  $scope.appOptions.showMenubar = false;
  $scope.title = "Register";
  $scope.registerModel = {};
  $scope.blockUI = false;
  
  $scope.saveRegistration = function(){
    
    var model = {
        FirstName: $scope.registerModel.fn
      , LastName: $scope.registerModel.ln
      , UserName: $scope.registerModel.mobileno
      , ClientKey: $scope.registerModel.clientId
      , Picture : $scope.registerModel.Thumbnail
    };
    
    authService.register(model).then(
      function(d){
        if(d.data.isError){

          return;
        }
        //toaster.pop('success', 'Registration successful', 'You will shortly recieve the authentication code via SMS.');
        var message = " Please enter your authorization code'";
        
        storageService.add('user',model);
        storageService.add('status',"REQUESTED");
        $state.go("account.registrationSuccess");
      },
      function (e){
        //$scope.addAlert(e.message,"danger");
        //toaster.pop('error', '', e.message);
      });
  }
  
});


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


// angular.module("cp")
// .controller("userSelectorCtrl", 
var userSelectorCtrl = function($scope, $log, $q, $mdDialog, $timeout, storageService, dataService){
  $scope.showLoader = false;
  $scope.addedMembers = [];
  $scope.members = [];
  $scope.searchText = "";
  $scope.selectedUser = null;

  var preInit = function(){
      tasks = [];
      $q.all([
        $scope.getUsers("")
      ])
      .then(function(){
        $scope.ready = true;
        init()
      })
  };
  
  var init = function(){

  }

  $scope.getUsers = function(term){
    var defer = $q.defer();
    dataService.getUsers(term)
    .then(function(d){   
        defer.resolve(d.data.data);
    });
    return defer.promise;

  }
  $scope.addMember = function(item){
    var exist = false;
    $scope.members.forEach(function(u){
      if(u.UserName == item.UserName){
        exist = true;
      }
    });
    if(!exist){
      $scope.addedMembers.push (item);
    }

  } 
  var getGroupMembers = function(groupId){
    var defer = $q.defer();
    return dataService.getGroupMembers(groupId)
    .then(function(d){
        angular.copy(d.Data, members);
    });

    return defer.promise;
  }


  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.done = function(answer) {
    $scope.showLoader(answer);
  };

  
  preInit();  
  
}
//);

angular.module("cp").controller("indexCtrl", 
['$scope', '$log', '$state', '$stateParams', 'storageService', 'authService', '$mdSidenav', 'dataService',
function ($scope, $log, $state, $stateParams,   storageService, authService, $mdSidenav, dataService){
	$scope.currentViewName = "..." 
	$scope.myGroups = [];
  
	$scope.themes = ['default','light-blue','amber','cyan', 'yellow', 'light-green','lime'];
  	$scope.theme = storageService.get("theme") ;
	if($scope.theme == undefined){
		$scope.theme = 0;
	}

	var init = function(){

		dataService.getGroups().then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				angular.copy(d.data.data,$scope.myGroups);  
				$scope.myGroups.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
				   });
			}
		});
	};
	$scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'left'
      };

	//Set next theme
	$scope.nextTheme = function(){
		if(($scope.theme + 1) >= $scope.themes.length){
			$scope.theme = 0;
		}
		else{
			$scope.theme++;
		}
		
		storageService.add("theme",$scope.theme) ;	
		
		
	}
	$scope.toggleLeft = function(){
		return $mdSidenav('left')
          .toggle();
	}
	
	
	init();

}]);
angular.module("cp")
.controller("dashboardCtrl", function($scope, $log, $location, storageService, dataService){
  $scope.title = "Dashboard"
  var init = function(){
  };
  init();  
  
});
angular.module("cp")
.controller("groupsCtrl", function($scope, $log, $state, $stateParams, 
    storageService, dataService){
  $scope.currentViewName = "Groups";
  $scope.id = $stateParams.id;
  $scope.infoSlideOpen = false;
  $scope.groups = $scope.$parent.assetTree;
  $scope.selected = {};
  $scope.groupList = [];
  $scope.fabIsOpen = false;
  $scope.groupsLoading = false;
  $scope.assetsLoading = false;
  
  var init = function(){
    $scope.groupList = [];
    $scope.groupsLoading = true;
    dataService.getGroups().then(function(d){
     if(d.data.isError){
        //toaster.pop("error","",d.Message)
      }
      else{
        angular.copy(d.data.data,$scope.groupList);  
        $scope.groupList.forEach(function(obj){
              
              obj.DateCreated = new Date(obj.DateCreated);
         });
      }
      $scope.groupsLoading = false;
      
    }, function(e){
      //console.error(e);
    });

  };
  var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  $scope.refresh = function(){
      angularGridInstance.gallery.refresh();
  } 
    
  
  $scope.viewGroupInfo = function(node){
    
      $scope.selected.group = node;
      if($scope.selected.group){
        $scope.infoSlideOpen = true;
      }
  };
  
  $scope.editGroup = function(grp){
    if(grp){
      $state.go("index.editgroup", {id:grp._id});
    }
    else{
      $state.go("index.editgroup");
    }
      
  };
  
  $scope.openGroup = function(node){
    
      $scope.selected.parent = node;
      $state.go("index.group", {id:node._id});

  };
    
  init();  
});
angular.module("cp").controller("addEditGroupCtrl", 
['$scope', '$log', '$q','$state', '$stateParams', '$mdToast', 'storageService','$timeout', 'Upload', 'dataService', '$mdMedia','$mdDialog', '$window',
function ($scope, $log, $q, $state, $stateParams, $mdToast,  storageService, $timeout, Upload, dataService,$mdMedia, $mdDialog, $window){
	$scope.$parent.currentViewName = "Edit Group";
	
	$scope.isLoading = false;
	$scope.defaultImage = "./content/images/group-default3.png"
	$scope.toastPosition = 'top';
	$scope.message = "";
    $scope.currentView = "main";
	$scope.current = {
		action:"Create",
	    id:0,
	    group:{},
	    selectedUser:null
	};
	$scope.selectedUser = {Name:'Not selected'};
	/*Add participants*/
	$scope.members = [];
	$scope.searchText = "";
	$scope.searchResult = [];
	$scope.showMemberManagement = false;
	var preInit = function(){
		$scope.isLoading = true;
        $scope.current.group = {
            Id : 0,
            Name : "",
            Description : "",
            Status : "",
            Thumbnail : null,
            Url:"",
            GroupType : "",
            Members:[]
        }
		if($stateParams.id != 0)
		{
			$scope.current.group._id = $stateParams.id;
			$scope.$parent.currentViewName = "Create Group" ;
		}
		
		if($scope.current.group._id && $scope.current.group._id != 0){
			getGroupDetail($scope.current.group._id)
			.finally(function(d){
				init();
			});
		}
		else{
			init();
		}

// 		var tasks = [];
// 		if($scope.current.group._id && $scope.current.group._id != 0){
// 			tasks.push(getGroupDetail($scope.current.group._id));
// 		}
//   		$q.all([
// 			getGroupDetail($scope.current.group._id)
//   		])
	}
  	
	var init = function(){
		//$scope.showToast("Loaded", "");
		$scope.isLoading = false;
	};
	$scope.showToast = function(msg, type) {
		var toast = $mdToast.simple()
			  .content(msg)
			  .action('OK')
			  .highlightAction(true)
			  .position('top');

		$mdToast.show(toast).then(function(response) {
		  if ( response == 'ok' ) {

		  }
		});
	};
	
	var getGroupDetail = function(id){
		//var defered = $q.defer();
		var promise =  dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				//angular.copy(d.data.data,$scope.myGroups);  
				d.data.data.forEach(function(obj){
					//obj.Id = obj._id;
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.current.group = d.data.data[0];

			   	//if this group is created by current user then allow user to manage users

			   	if($scope.current.group.CreatedBy == $scope.AUTHDATA._id ){
			   		$scope.showMemberManagement = true;
			   	}
			   	
			}
			//defered.resolve();
		},
		function(){
			//defered.reject();
		}
		);
		return promise;
	};
	
	$scope.save = function(){
		$scope.message = "";
		//blockUI()
		//$scope.current.group._id = $scope.current.group.Id; 
		dataService.saveGroup($scope.current.group)
		.then(function(g){
			
			$scope.showToast("Group saved.");
			//if this group is created by current user then allow user to manage users
			$scope.current.group._id = g.data._id;
			$scope.current.group.Members = g.data.Members;
			$scope.current.group.CreatedBy = g.data.CreatedBy;
			if($scope.current.group.CreatedBy == $scope.AUTHDATA._id ){
				$scope.showMemberManagement = true;
			}
		},
		function(e){
			$log.error(e);
		});
	}
	
	$scope.getUsers = function(term){
		var defer = $q.defer();
		dataService.getUsers(term)
		.then(function(d){   
			var users = [];
			d.data.data.forEach(function(u){
				u.Name = u.FirstName + ' ' + u.LastName;
			});
			defer.resolve(d.data.data);
		});
		return defer.promise;
	}
	
  	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
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
                    	$scope.current.group.Thumbnail = response.data.url
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
	var confirmMessageHtml = 
			'<md-dialog aria-label="List dialog" class="layout-padding">' +
           '  <md-dialog-heading>'+
           '  	<h2>{{title}}</h2>'+	
           '  </md-dialog-heading>'+
           '  <md-dialog-content>'+
		   '	<img ng-disabled="item.__added"  ng-if="item.Picture!=null" ng-src="{{item.Picture}}" class="md-avatar" />' +
           '         <ez-initials ng-disabled="item.__added" ng-if="item.Picture==null" class="md-avatar" text="item.FirstName" ></ez-initials >'+
           '         <div class="md-list-item-text" layout="column">' +
           '                 <h3>{{ item.FirstName }} {{item.LastName }}</h3>' +
           '                 <p>{{ item.UserName}}, {{item.City }}</p>' +
           '                 <p>{{item.__added==true?"Added":""}}' +
           '         </div>' + 
		   '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="confirmed()" class="md-primary">' +
           '      Yes' +
           '    </md-button>' +
           '  	<md-button ng-click="canceled()" class="md-primary">' +
           '      Cancel' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>';
	
	$scope.removeMemberConfirmation = function(ev,selUser) {
		var confirmOpts = {
			template: confirmMessageHtml,
			//targetEvent:ev,
			locals: {
			   item: selUser,
			   title: 'Remove member '
			 },
			controller : function ($scope, $mdDialog, item, title){
				$scope.item = item;
				$scope.title = title;
				$scope.confirmed = function() {
              		$mdDialog.hide();
              	}
              	$scope.canceled = function() {
              		$mdDialog.cancel();
              	}
			}
		}
		
		$mdDialog.show(confirmOpts)
		.then(function(a){
			removeMember(selUser);
		}, function(e){
			
		})
		.finally(function(a) {
            cnf = undefined;
          });

	};           
	var removeMember = function (item){
		var data = 
		{
			"groupId":$scope.current.group._id,
			"members":[item._id]
		}
		dataService.removeGroupMembers(data).then(function(d){
			if(d.isError){
				$scope.showToast("Failed to add member", "");	
			}
			else{

				var index = _.indexOf(_.pluck($scope.current.group.Members, '_id'), item._id);
				$scope.current.group.Members.splice(index,1);		
				
			}
		});

	}
	$scope.onSerch = function(searchText){
		$scope.searchResult=[];
		if(searchText && searchText.length > 0){

		}
		
		$scope.getUsers(searchText).then(function(d){
			
			d.forEach(function(u){
				//check if this user is alredy added
				var exist = _.findWhere($scope.current.group.Members,{"_id":u._id});
				if(exist){
					u.__added = true;
				}
			})
			var sorted = _.sortBy(d,"FirstName");
			angular.copy(sorted,$scope.searchResult)
			
		})
	}

	$scope.addMemberConfirmation = function(ev,selUser) {
		var confirmOpts = {
			template: confirmMessageHtml,
			//targetEvent:ev,
			locals: {
			   item: selUser,
			   title: 'Add new member  '
			 },
			controller : function ($scope, $mdDialog, item, title){
				$scope.item = item;
				$scope.title = title;
				$scope.confirmed = function() {
              		$mdDialog.hide();
              	}
              	$scope.canceled = function() {
              		$mdDialog.cancel();
              	}
			}
		}
		
		
		$mdDialog.show(confirmOpts)
		.then(function(a){
			
			addMember(selUser);
		}, function(e){
			
		})
		.finally(function(a) {
          
          });

	};

	var addMember = function (selUser){
		var exist = false;
		$scope.current.group.Members.forEach(function(u){
		  if(u.UserName == selUser.UserName){
			exist = true;
		  }
		});
		if(!exist){
			var data = 
			{
				"groupId":$scope.current.group._id,
				"members":[selUser._id]
			}
			dataService.addGroupMembers(data).then(function(d){
				if(d.isError){
					$scope.showToast("Failed to add member", "");	
				}
				else{
					$scope.showToast("Member added", "");	
					$scope.current.group.Members.push(selUser);
					selUser.__added = true;
				}
			});
		}
	}

	


	$scope.cancel =function(){
		//take back to list of groups
		$window.history.back();
	}
    $scope.showAddMembers = function(){
        $scope.currentView = "members"
    }
    $scope.cancelMemberAdd = function(){
        $scope.currentView = "main"
    }
	preInit();
}]);

angular.module("cp").controller("groupDetailCtrl", 
['$scope', '$log', '$q','$state', '$stateParams','$timeout', 'storageService', 'dataService','$mdToast','$mdDialog',
function ($scope, $log, $q, $state, $stateParams, $timeout, storageService, dataService, $mdToast, $mdDialog){
	$scope.$parent.currentViewName = "Group Detail" 
	$scope.isLoading = false;
	$scope.isSaving = false;
	$scope.view = "list";
	$scope.current = {
		action:"View",
	    id:0,    
	};

	$scope.group = null;

	$scope.filter = {
		from:null,
		groupId:$stateParams.id,
		topicId:null,
		count:100,
	}
	
	$scope.assets = [];
  	$scope.selectedTopic = null;


	if($stateParams.id){
		$scope.current.id = $stateParams.id;
	}
	if($stateParams.view){
		$scope.current.action = $stateParams.action;
	}

	var preInit = function(){
		var tasks = [];
		$scope.isLoading = true;
  			
		if($scope.current.id != ''){
			tasks.push(getGroupDetail($scope.current.id));
		}
  		$q.all([
			tasks
  		])
  		.then(function(){
  			init()
  		});
  	}
  	
	var init = function(){
		var localRepo = storageService.get($scope.filter.groupId);
		if(localRepo == null){
		  localRepo = {
			"lastUpdated" : null,
			"list" : []
		  };
		}
		else if(localRepo.list == null){
		  localRepo.list = [];
		}

		var localAssets = localRepo.list;
		angular.copy(localAssets, $scope.assets);
		
		$timeout(getAssets(),100);
		
	};

	var getGroupDetail = function(id){
		$scope.isLoading = true;
		return dataService.getGroup(id).then(function(d){
			if(d.data.isError){
				//toaster.pop("error","",d.Message)
			}
			else{
				//angular.copy(d.data.data,$scope.myGroups);  
				d.data.data.forEach(function(obj){
					  obj.DateCreated = new Date(obj.DateCreated);
			   	});
			   	$scope.group = d.data.data[0];
			   	
			}
		}).finally(function(){
			$scope.isLoading = false;
		});

	}
	
	var getAssets = function(){
		$scope.filter.from = lastUpdatedInLocalRepo();
		dataService.getAssets($scope.filter)
		.then(function(d){
		  //append the local list
		  d.data.data.forEach(function(a){
			$scope.assets.push(a)
		  });

		  //addd this to local storageService
		  var store = {
			"lastUpdated":new Date(),
			"list":$scope.assets,
		  }

		  storageService.add($scope.filter.groupId,store);
		});
	};

	var lastUpdatedInLocalRepo = function(){
		var last =  new Date(2015,1,1);
		var localRepo = storageService.get($scope.filter.groupId);
		if(localRepo && localRepo.lastUpdated){
		  last = new Date(localRepo.lastUpdated);
		}
		return last;
	}  

	$scope.refreshRepo = function(){    
		var lastUpdated = new Date(1,1,2015);
		storageService.add($scope.filter.groupId,{
		  "list":[],
		  "lastUpdated"  : lastUpdated,
		});
	}

	$scope.createAsset= function(){
		$scope.view = "item";

	}


	$scope.backToList= function(){
		$scope.view = "list";

	}

//----------------------------------------------------------------------------------------------//
//				ASSET 
//----------------------------------------------------------------------------------------------//
	
	$scope.parent = $scope.current.id;
// 	if($stateParam.parent){

// 	}
	$scope.categories = [
		{"_id": "cat_Comment", "Name":"Comment", "icon" : "announcement"},
// 		{"_id": "cat_Event", "Name":"Event", "icon" : "event"},
// 		{"_id": "cat_Topic", "Name":"Topic", "icon" : "folder"},
// 		{"_id": "cat_Issue", "Name":"Issue", "icon" : "report_problem"},
// 		{"_id": "cat_Task", "Name":"Task", "icon" : "assignment"},
// 		{"_id": "cat_Questionnaire", "Name":"Questions", "icon" : "questionnaire"},
		
	]
	


	$scope.selectedCategory = $scope.categories[0];
	

	$scope.asset = {
		"CategoryId" : $scope.selectedCategory._id,
		"Name":"",
		"Description":"",
		"Thumbnail":"",
		"Urls":"",
		"GroupId":$scope.current.id,
		"ParentId":$scope.parent
	}
	$scope.openCategoryMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

	$scope.setCategory = function(category, ev) {
      originatorEv = ev;
      $scope.selectedCategory = category;
      
    };
	
	$scope.saveAsset = function() {
		$scope.isSaving = true;
		var isValid = validate();     
		dataService.saveAsset($scope.asset)
		.then(function(d){
			if(d.data.isError){
				$scope.showToast("Error occured,", "error");
			}
			else{
				updateLocalRepo(d.data.data);
				//getAssets();
				$scope.showToast("Created!", "success");
				
				//change to list view
				$scope.view = "list";

			}
			$scope.isSaving = false;
		}, function(e){
			$scope.showToast("Error occured,", "error");
			$scope.isSaving = false;
		}); 
    };
	var updateLocalRepo = function(asset){
		var localRepo = storageService.get($scope.filter.groupId);
		
		var localAsset = _.where(localRepo.list, {"_id":asset._id});
		
		if(localAsset == null){
			localAsset = asset;
		}else{
			localRepo.list.push(asset);
		}

		var localRepo = storageService.get($scope.filter.groupId);
	}
	var validate = function(){
		var isValid = true;
		if($scope.asset == null){
			isValid = false;
		}

		if($scope.asset.Name == "" && $scope.Description == ""){
			isValid = false;
		}
		return true;
	}

	$scope.showToast = function(msg, type) {
		var toast = $mdToast.simple()
			  .content(msg)
			  .action('OK')
			  .highlightAction(true)
			  .position('top');

		$mdToast.show(toast).then(function(response) {
		  if ( response == 'ok' ) {
				
		  }
		});
	};
//-------------------------------------
	$scope.height = "96px";
	$scope.width = "96px";
	$scope.uploadUrl = "";
	
	if($scope.thumbnail==""){
		$scope.thumbnail = "https://placehold.it/96x96"
	}
	$scope.openThumbnailDialog = function($event){
		var parentEl = angular.element(document.body);
	   $mdDialog.show({
		 parent: parentEl,
		 targetEvent: $event,
		 templateUrl:"thumbnailDialogTemplate.html",
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



	preInit();
}]);