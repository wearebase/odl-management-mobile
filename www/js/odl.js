var odl = angular.module('odl', []);

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