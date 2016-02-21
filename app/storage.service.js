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
      if(key){

        return $localStorage["cp-data"][key];
      }
      else{
        return $localStorage["cp-data"];
      }
    },    
    remove : function(key)
    {
      if(key){
        if($localStorage["cp-data"][key] != undefined)
        {
          $localStorage["cp-data"][key] = undefined;  
        }
      } else{
        $localStorage["cp-data"] = {};
      }

    }
    
  };
});