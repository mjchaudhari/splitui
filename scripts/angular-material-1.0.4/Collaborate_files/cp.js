/// <reference path="../typings/angularjs/angular.d.ts"/>
// Code goes here
 //module = angular.module('ezDirectives', ['ngFileUpload']);
 var app = angular.module('cp', ['ngMaterial','ngMdIcons', 'ngAnimate', 'ngSanitize', 'ui.router',
      ,'ngStorage','ngFileUpload', 'ezDirectives','angular-cache']);
 
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
 
