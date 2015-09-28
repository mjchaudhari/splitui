
'use strict';

angular.module('cp').factory('httpInterceptor', ['$q', '$location', 'storageService','$log',
function ($q, $location, storageService, $log) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        if (config.url.search('token') == -1 && config.url.search('ForgotPassword')=='-1') {
                                
            config.headers = config.headers || {};

            var authData = storageService.get('cpAdmin');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
        }
        return config;
    }

    // On request failure
    var _requestError= function (rejection) {
        //console.log(rejection); // Contains the data about the error on the request.
        // Return the promise rejection.
        return $q.reject(rejection);
    }

    // On response success
    var _response= function (response) {
        //console.log(response); // Contains the data from the response.
        // Return the response or promise.
        return response || $q.when(response);
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            //if (window.location.pathname.indexOf(global.appLoginPath) < 0) {
            if ($location.$$path.indexOf("Login") < 0)
            {
                //$location.path(global.appLoginPath);
                //window.location = global.appBaseUrl + global.appLoginPath;
                //utils.goToLoginPage();
                $log.info('Unauthenticated...redirecting to login page.');
                $location.path("/Login");
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