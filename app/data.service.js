angular.module('cp').factory('dataService', 
function($http,$q, $log, $timeout){
  var treeData =
         {
          Name: "root",
          Id:1,
          Children:[
            {
              Name: "Flat 1",
              Id:2,
              Children:[
                {
                  Name: "Jan",
                  Id:4,
                  Children:[
                  {
                      Name: "socity charges",
                      Id:41,
                      Children:[

                      ]
                    }
                  ]
                }
                ,
                {
                  Name: "Feb",
                  Id:5,
                  Children:[

                  ]
                }
              ]
            },
            {
              Name: "Flat 2",
              Id:3,
              Children:[
                {

                }
              ]
            }
          ]
        };
        
  return {
    apiPrefix : config.apiBaseURL,  
    
    getUser : function( ){
      
    },
    
    getUsers : function( ){
      
      return $http.get(apiPrefix + "/User");
    },
    
    register : function( registerModel){
      var url = config.apiBaseUrl + "/register";
      $log.debug(url);
      return $http.post(url, registerModel);
    },
    
    verifyPin : function( data){
      var url = config.apiBaseUrl + "/pin/verify";
      return $http.post(url, data);
    },
    
    resendPin : function( data){
      var url = config.apiBaseUrl + "/pin/resend";
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