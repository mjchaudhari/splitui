
angular.module('cp').factory('authService', ['$http','$log','$q', 'storageService', 
	function ($http, $log, $q, storageService) {

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

