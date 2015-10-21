
angular.module('cp').factory('authService', ['$http', '$q', 'storageService', 
	function ($http, $q, storageService) {

    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _UserDetail = {
        UserId: "",
        FirstName: "",
        LastName: "",
        BusinessUnit: { Id: '', Name: '', Description: '' },
        UserRole: { Id: '', Name: '', Description: '' },
        Accesslevel: { Id: '', Name: '', Description: '' },
        Email: "",
    };
	
    var _login = function (credentials) {
        var data = "client_id=admin&grant_type=password&username=" +
                    credentials.username + "&password=" + credentials.password;
        var deferred = $q.defer();
        var config = {
            headers:
              {
                  //"Content-Type": "application/x-www-form-urlencoded",
                  //"Authorization": "Basic Y2xpZW50MTpzZWNyZXQ="
              }
        };

        //$http.defaults.headers.common.Authorization = 'Basic Y2xpZW50MTpzZWNyZXQ=';
        $http.post(config.apiBaseUrl + '/token', data, config)
            .success(function (response) {

                storageService.set('adminAuthorizationData',
                { token: response.access_token, username: credentials.username });

                _authentication.isAuth = true;
                _authentication.username = credentials.username;

                deferred.resolve(response);

            }
          ).error(function (err, status) {
              _logOut();
              deferred.reject(err);
          });
        return deferred.promise;
    };

    var _getUserDetails = function () {
        var deferred = $q.defer();
        //var request = { UserName: _authentication.username };
        var url = config.apiBaseUrl + 'User/Details/';
        $http.get(url)
            .success(function (response) {

                var res = response;
                _UserDetail.UserId = res.Id;
                _UserDetail.FirstName = res.FirstName;
                _UserDetail.LastName = res.LastName;
                _UserDetail.Email = res.Email;

                if (res.BusinessUnit)
                {
                    _UserDetail.BusinessUnit.Id = res.BusinessUnit.Id;
                    _UserDetail.BusinessUnit.Name = res.BusinessUnit.Name;
                    _UserDetail.BusinessUnit.Description = res.BusinessUnit.Description;
                }
                if (res.Accesslevel) {
                    _UserDetail.Accesslevel.Id = res.Accesslevel.Id;
                    _UserDetail.Accesslevel.Name = res.Accesslevel.Name;
                    _UserDetail.Accesslevel.Description = res.Accesslevel.Description;
                }
                if (res.UserRole) {
                    _UserDetail.UserRole.Id = res.UserRole.Id;
                    _UserDetail.UserRole.Name = res.UserRole.Name;
                    _UserDetail.UserRole.Description = res.UserRole.Description;
                }

                _UserDetail.FirstName = res.FirstName;
                _UserDetail.LastName = res.LastName;

                storageService.set('UserData', {
                    UserId: _UserDetail.UserId ,
                    UserRole: _UserDetail.UserRole,
                    Accesslevel: _UserDetail.Accesslevel,
                    FirstName: _UserDetail.FirstName,
                    LastName: _UserDetail.LastName,
                    Email: _UserDetail.Email
                });

                deferred.resolve(response);
            })
			.error(function (err, status) {
                    deferred.reject(err);
            });
        return deferred.promise;
    };

    var _forgetpassword = function (email) {
        var deferred = $q.defer();
        var request = { UserName: email };
        var url = config.apiBaseUrl + 'User/GetPwd';
        $http.post(url,request)
            .success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {

                deferred.reject(err);
        });
        return deferred.promise;
    };


    var _changepassword = function (passwordModel) {
        var deferred = $q.defer();
        $http.post(config.apiBaseUrl + 'User/Password/Change', passwordModel)
            .success(function (response) {
                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    var _fillUserDetails = function () {
        var UserData = storageService.get('UserData');
        if (UserData) {
            _UserDetail.UserId = UserData.UserId;
            _UserDetail.UserRole = UserData.UserRole;
            _UserDetail.FirstName = UserData.FirstName;
            _UserDetail.LastName = UserData.LastName;
            _UserDetail.Accesslevel = UserData.Accesslevel;
            _UserDetail.Email = UserData.Email;
        }
    };

    var _logOut = function () {

        storageService.remove('adminAuthorizationData');
        storageService.remove('UserData');

        _authentication.isAuth = false;
        _authentication.userName = "";
    };

    var _fillAuthData = function () {

        var authData = storageService.get('adminAuthorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }
    };

    var _isAuthenticated = function () {

        if (_authentication.isAuth) {
            return true;
        }
        else {
            return false;
        }

    };

    var _getLoggedOnUserId = function () {
        return storageService.get('UserData').UserId;
    }

    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.isAuthenticated = _isAuthenticated;
    authServiceFactory.fillUserDetails = _fillUserDetails;
    authServiceFactory.getUserDetails = _getUserDetails;
    authServiceFactory.UserDetail = _UserDetail;
    authServiceFactory.fillPortalViewDetails = _fillPortalViewDetails;
    authServiceFactory.getPortalViewDetails = _getPortalViewDetails;
    authServiceFactory.PortalViewDetail = _PortalViewDetail;
    authServiceFactory.forgetPassword = _forgetpassword;
    authServiceFactory.changePassword = _changepassword;
    authServiceFactory.getLoggedOnUserId = _getLoggedOnUserId;

    return authServiceFactory;
}])

