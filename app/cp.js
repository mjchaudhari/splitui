/// <reference path="../typings/angularjs/angular.d.ts"/>
// Code goes here
 var app = angular.module('cp', ['ui.router',
 'ui.bootstrap', 'toaster','ngStorage', 'ui.layout','pageslide-directive','ezDirectives']);
 
 app.config([ "$httpProvider","$urlRouterProvider", '$stateProvider',
 function($httpProvider, $urlRouterProvider, $stateProvider){
   
   $httpProvider.interceptors.push('httpInterceptor');
   
   $urlRouterProvider.otherwise("/");
   
   $stateProvider
      .state("home", {url:"/", templateUrl : "/views/intro.html"})      
      .state("intro", {url:"/intro", templateUrl : "/views/intro.html"})
      //Account
      .state("account",{url:"/account", templateUrl:"/views/account/index.html"}) 
      .state("account.login",{url:"/login", templateUrl:"/views/account/login.html"}) 
      .state("account.register",{url:"/register", templateUrl:"/views/account/register.html"}) 
      .state('account.resendpin',{url:"/resendpin", templateUrl: 'views/account/resendPin.html'})

      .state('help',{url:"/help", templateUrl: '/views/help.html'})
      //Index routes
      .state('index',{url:"/index", templateUrl: '/views/index.html'})
      .state('index.dashboard',{url:"/dashboard", templateUrl: '/views/dashboard.html'})
      .state('index.groups',{url:"/groups", templateUrl: '/views/groups/groups.html'})
      .state('index.group',{url:"/group?id&action", templateUrl: '/views/groups/groupDetail.html'})
      
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
 
