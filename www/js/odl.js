var odl = angular.module('odl', ['ngRoute']);
odl.service('CordovaService', function($rootScope) {
    var listener = function() {
        $rootScope.$emit('cordovaReady');
    };
    this.destroy = function() {
        document.removeEventListener('deviceready', listener, false);
    };
    document.addEventListener('deviceready', listener);
});
odl.controller('ReadyController', function($rootScope, $scope, $location, CordovaService) {
    $rootScope.$on('cordovaReady', function() {
        $scope.$apply(function() {
            $scope.ready = true;
        });
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