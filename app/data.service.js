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

  };
});