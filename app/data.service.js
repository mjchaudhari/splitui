angular.module('cp').factory('dataService', 
function($http,$q, $log, $timeout){
  
  return {
    apiPrefix : config.apiBaseUrl,  
    
    getUser : function( ){
      
    },
    
    getUsers : function( ){
      
      return $http.get(apiPrefix + "/User");
    },
    
    getChildren  :function(id){
      if(!id)
      {
        id = 0;
      }
      var url = config.apiBaseUrl + "/v1/artifact/tree/" + id;
      return $http.post(url, data);   
    },
    getGroups : function(){
      
      var url = config.apiBaseUrl + "/v1/groups?status=active";
      return $http.get(url);
    },
    getGroup : function(id){
      
      var url = config.apiBaseUrl + "/v1/groups?id="+id;
      return $http.get(url);
    },
    saveGroup : function(grp){
      
      var url = config.apiBaseUrl + "/v1/group";
      return $http.post(url, grp);
    }

  };
});