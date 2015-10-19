
'use strict';

angular.module('cp').factory('httpInterceptor', ['$q', '$location', '$injector', 'storageService','$log',
function ($q, $location, $injector , storageService, $log) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        if (config.url.search('token') == -1 && config.url.search('ForgotPassword')=='-1') {
                                
            config.headers = config.headers || {};

            var authData = storageService.get('__splituserat');
            if (authData) {
                
                config.headers.Authorization = 'Bearer ' + authData;
            }
        }
        return config;
    }

    // On request failure
    var _requestError= function (rejection) {
        return $q.reject(rejection);
    }

    // On response success
    var _response= function (response) {
        return response || $q.when(response);
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            if ($location.$$path.indexOf("Login") < 0)
            {
                $log.info('Unauthenticated...redirecting to login page.');
                $injector.get('$state').go("account.login");
            }
        }
        else {
            
            //$log.error('Status: ' + rejection.status + ' , Message: ' + rejection.statusText);
            //$log.debug( 'Response Error: - ' + JSON.stringify(rejection));
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.requestError = _requestError;
    authInterceptorServiceFactory.response = _response;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);