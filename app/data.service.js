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
    
    getChildren  :function(id){
      if(!id)
      {
        id = 0;
      }
      var url = config.apiBaseUrl + "/v1/artifact/tree/" + id;
      return $http.post(url, data);   
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

  };
});