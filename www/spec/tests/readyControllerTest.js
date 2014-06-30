describe('Ready Controller', function() {

    var unit, rootScope;

    beforeEach(angular.mock.module('odl'));

    beforeEach(angular.mock.inject(function($rootScope, $controller) {
        rootScope = $rootScope;
        unit = $rootScope.$new();
        $controller('ReadyController', {$scope: unit});
    }));

    it('should exist', function() {
        expect(unit).not.toBeUndefined();
    });

    it('should set the ready flag to true when the device is ready', function() {
        expect(unit.ready).toBeUndefined();
        rootScope.$emit('cordovaReady');
        expect(unit.ready).toBe(true);
    });
});
