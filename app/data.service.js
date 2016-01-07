angular.module('cp').factory('dataService', 
function($http,$q, $log, $timeout){
  
  return {
    apiPrefix : config.apiBaseUrl,  
    
    getUser : function( ){
      
    },
    
    getUsers : function(searchTerm ){
      if(searchTerm)
      {
        return $http.get(this.apiPrefix + "/v1/user/search" + "?term=" + searchTerm);
      }
      else
      {
        return $http.get(this.apiPrefix + "/v1/user/search");
      }
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
      
      var url = config.apiBaseUrl + "/v1/groups?_id="+id;
      return $http.get(url);
    },
    saveGroup : function(grp){
      
      var url = config.apiBaseUrl + "/v1/group";
      return $http.post(url, grp);
    },
    getGroupMembers : function(id){
      
      var url = config.apiBaseUrl + "/v1/group/members?groupid="+id;
      return $http.get(url);
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

  };
});