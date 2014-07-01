var odl = angular.module('odl', ['ngRoute', 'ngAnimate', 'ngCordova']);
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

odl.service('serverService', function($q) {
    this.getDevice = function() {
        return $http.get('http://odl-uat.herokuapp.com/api/device');
    };
});

//////////// Controllers
odl.controller('ReadyController', function($scope, cordovaService) {
    cordovaService.ready(function() {
        $scope.ready = true;
    });
});

odl.controller('InfoController', function($scope, $cordovaBarcodeScanner, serverService) {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
        $scope.guid = imageData;
        serverService.getDevice(imageData).then(function(device) {
            $scope.device = device;
        });
    }, function(err) {
    });
});

// configure our routes
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
        controller: 'ReadyController'
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