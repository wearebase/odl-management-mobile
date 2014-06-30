describe('Cordova Service', function() {

    var unit, rootScope;

    beforeEach(angular.mock.module('odl'));

    beforeEach(inject(function ($rootScope, CordovaService) {
        rootScope = $rootScope;
        unit = CordovaService;
    }));

    afterEach(function() {
        unit.destroy();
    });

    it('should exist', function() {
        expect(unit).not.toBeUndefined();
    });

    it('should fire a cordovaReady event when the deviceready event is fired', function(done) {
        rootScope.$on('cordovaReady', done);
        helper.trigger(window.document, 'deviceready');
    });
});
