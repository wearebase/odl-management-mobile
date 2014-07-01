describe('Ready Controller', function() {

    var unit;

    beforeEach(module('odl'));

    beforeEach(angular.mock.inject(function($rootScope, $controller) {
        unit = $rootScope.$new();
        $controller('ReadyController', {$scope: unit});
    }));

    it('should set the ready flag to true when the device is ready', function() {
        expect(unit.ready).toBeUndefined();
        helper.trigger(window.document, 'deviceready');
        expect(unit.ready).toBe(true);
    });

});
