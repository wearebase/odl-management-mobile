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
});

odl.controller('ReadyController', function($scope, cordovaService) {
    cordovaService.ready(function() {
        $scope.ready = true;
    });
});

odl.controller('InfoController', function($scope, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.guid = imageData.text;
        serverService.getDevice($scope.guid).then(function(device) {
            $scope.device = device;
        }, handleError);
    }, handleError);
});

odl.controller('AddController', function($scope, $cordovaBarcodeScanner, serverService) {
    function handleError(error) {
        $scope.error = error;
    }

    $scope.addDevice = function() {
        serverService.addDevice($scope.guid, $scope.imei, $scope.humanId).then(function(device){
            $scope.device = device;
        }, handleError);
    };

    $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.guid = imageData.text;
    }, handleError);
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
        controller: 'ReadyController'
    })
    .when('/checkout', {
        templateUrl: 'pages/checkout.html',
        controller: 'ReadyController'
    });
});