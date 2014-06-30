var odl = angular.module('odl', ['ngRoute', 'ngAnimate']);
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
odl.controller('ReadyController', function($rootScope, $scope, $location, cordovaService) {
    cordovaService.ready(function() {    
        $scope.ready = true;        
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
        controller: 'ReadyController'
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