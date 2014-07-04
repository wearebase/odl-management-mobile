angular.module('config', [])
.constant('settings', {
    api: 'http://odl-uat.herokuapp.com/api'
});

var odl = angular.module('odl', ['config', 'ngRoute', 'ngAnimate', 'ngCordova']);

odl.service('cordovaService', function($rootScope) {
    var loaded = false;
    var callback;

    var listener = function() {
        loaded = true;
        $rootScope.$apply(callback);
    };
    this.destroy = function() {
        document.removeEventListener('deviceready', listener, false);
    };
    this.ready = function(cb) {
        if (loaded) {
            cb();
        } else {
            callback = cb;
        }
    };
    document.addEventListener('deviceready', listener);
});

odl.service('serverService', function($http, $q, settings) {
    function handleResponse(response) { return response.data; }
    function handleError(error) { return $q.reject(error.data); }

    this.getDevice = function(guid) {
        return $http.get(settings.api + '/device/' + guid).then(handleResponse, handleError);
    };

    this.addDevice = function(guid, imei, humanId) {
        return $http.post(settings.api + '/device', {guid: guid, imei: imei, humanId: humanId}).then(handleResponse, handleError);
    };

    this.checkin = function(guid) {
        return $http.post(settings.api + '/check/in/' + guid).then(handleResponse, handleError);
    };

    this.checkout = function(guid) {
        return $http.post(settings.api + '/check/out/' + guid).then(handleResponse, handleError);
    };
});

odl.controller('ReadyController', function($scope, cordovaService) {
    cordovaService.ready(function() {
        $scope.ready = true;
    });
});

odl.controller('InfoController', function($scope, $location, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $scope.start = function() {
        delete $scope.device; delete $scope.error; delete $scope.guid;

        $cordovaBarcodeScanner.scan().then(function(imageData) {
            if (!imageData.cancelled && imageData.text) {
                $scope.guid = imageData.text;
                serverService.getDevice($scope.guid).then(function(device) {
                    $scope.device = device;
                }, handleError);
            }
        }, handleError);
    };
    $scope.start();
});

odl.controller('AddController', function($scope, $location, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $scope.start = function() {
        delete $scope.device; delete $scope.error; delete $scope.guid; delete $scope.imei; delete $scope.humanId;

        $cordovaBarcodeScanner.scan().then(function(imageData) {
            if (!imageData.cancelled && imageData.text) {
                $scope.guid = imageData.text;
            }
        }, handleError);
    };

    $scope.addDevice = function() {
        serverService.addDevice($scope.guid, $scope.imei, $scope.humanId).then(function(device){
            $scope.device = device;
        }, handleError);
    };

    $scope.start();
});

odl.controller('CheckinController', function($scope, $location, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $scope.start = function() {
        delete $scope.device; delete $scope.error; delete $scope.guid;

        $cordovaBarcodeScanner.scan().then(function(imageData) {
            if (!imageData.cancelled && imageData.text) {
                $scope.guid = imageData.text;
                $scope.checkin();
            }
        }, handleError);
    };

    $scope.checkin = function() {
        serverService.checkin($scope.guid).then(function(device){
            $scope.device = device;
        }, handleError);
    };

    $scope.start();
});

odl.controller('CheckoutController', function($scope, $location, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $scope.start = function() {
        delete $scope.device; delete $scope.error; delete $scope.guid;

        $cordovaBarcodeScanner.scan().then(function(imageData) {
            if (!imageData.cancelled && imageData.text) {
                $scope.guid = imageData.text;
                $scope.checkout();
            }
        }, handleError);
    };

    $scope.checkout = function() {
        serverService.checkout($scope.guid).then(function(device){
            $scope.device = device;
        }, handleError);
    };

    $scope.start();
});

odl.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'ReadyController'
    })
    .when('/info', {
        templateUrl: 'pages/info.html',
        controller: 'InfoController'
    })
    .when('/add', {
        templateUrl: 'pages/add.html',
        controller: 'AddController'
    })
    .when('/checkin', {
        templateUrl: 'pages/checkin.html',
        controller: 'CheckinController'
    })
    .when('/checkout', {
        templateUrl: 'pages/checkout.html',
        controller: 'CheckoutController'
    });
});