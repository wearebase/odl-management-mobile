describe('Checkout Controller', function() {

    var unit;

    beforeEach(module('odl'));

    beforeEach(angular.mock.inject(function($rootScope) {
        unit = $rootScope.$new();
    }));

    var createScannerMock = function(deferred) {
        var scanner = jasmine.createSpyObj('scanner', ['scan']);
        scanner.scan.and.returnValue(deferred.promise);
        return scanner;
    };

    var createServerMock = function(deferred) {
        var server = jasmine.createSpyObj('server', ['checkout']);
        server.checkout.and.returnValue(deferred.promise);
        return server;
    };

    it('should get GUID code from barcode scanner service', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var scanner = createScannerMock(deferred);
        var server = createServerMock($q.defer());

        $controller('CheckoutController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.device).toBeUndefined();
        expect(unit.guid).toBeUndefined();

        deferred.resolve({text: '012345679'}); $rootScope.$digest();

        expect(unit.guid).toBe('012345679');
        expect(scanner.scan).toHaveBeenCalled();
    }));

    it('should send a checkout device request', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var deferredServer = $q.defer();
        var server = createServerMock(deferredServer);
        var scanner = createScannerMock(deferred);

        $controller('CheckoutController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        unit.guid = '012345679';

        expect(unit.device).toBeUndefined();
        deferred.resolve({text: '012345679'});
        deferredServer.resolve({name: 'iphone', checkin: true});
        $rootScope.$digest();
        expect(server.checkout).toHaveBeenCalledWith('012345679');
        expect(unit.device).toEqual({name: 'iphone', checkin: true});
    }));

    it('should do nothing if the scan is cancelled', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock($q.defer());

        $controller('CheckoutController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        scannerDeferred.resolve({cancelled: true});
        $rootScope.$digest();

        expect(server.checkout).not.toHaveBeenCalled();
    }));

    it('should clear the scope at startup', angular.mock.inject(function($controller, $q, $rootScope) {
        var scanner = createScannerMock($q.defer());
        var server = createServerMock($q.defer());

        unit.device = {};
        unit.error = "";
        unit.guid = "";

        $controller('CheckoutController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.device).toBeUndefined();
        expect(unit.guid).toBeUndefined();
        expect(unit.error).toBeUndefined();
    }));

});