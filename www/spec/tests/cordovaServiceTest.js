describe('Cordova Service', function() {

    var unit, rootScope;

    beforeEach(module('odl'));

    beforeEach(inject(function ($rootScope, cordovaService) {
        rootScope = $rootScope;
        unit = cordovaService;
    }));

    afterEach(function() {
        unit.destroy();
    });

    it('should call the ready callback when the deviceready event is fired', function(done) {
        unit.ready(done);
        helper.trigger(window.document, 'deviceready');
    });

    it('should call the ready callback after the event has been published', function(done) {
        helper.trigger(window.document, 'deviceready');
        unit.ready(done);
    });
});
