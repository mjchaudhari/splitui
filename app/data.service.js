angular.module('cp').factory('dataService', 
function($http,$q, $log, $timeout){
  
  return {
    apiPrefix : config.apiBaseURL,  
    
    getUser : function( ){
      
    },
    
    getUsers : function( ){
      
      return $http.get(apiPrefix + "/User");
    },
    /**
    Register yourself
    */
    register : function( registerModel){
      var url = config.apiBaseUrl + "/v1/user";
      $log.debug(url);
      return $http.post(url, registerModel);
    },
    
    authenticate : function( data){
      var url = config.apiBaseUrl + "/v1/authenticate";
      return $http.post(url, data);
    },
    
    resendPin : function( data){
      var url = config.apiBaseUrl + "/v1/pin/resend";
      return $http.post(url, data);
    },
    getChildren  :function(id){
      if(!id)
      {
        id = 0;
      }
      var url = config.apiBaseUrl + "/v1/artifact/tree/" + id;
      return $http.post(url, data);   
    },
    getAssets : function(){
      if(!id)
      {
        id = 0;
      }
      var url = config.apiBaseUrl + "/v1/artifact/tree";
      return $http.post(url, data);
    }
    
  };
});