describe('Checkin Controller', function() {

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
        var server = jasmine.createSpyObj('server', ['checkin']);
        server.checkin.and.returnValue(deferred.promise);
        return server;
    };

    it('should get GUID code from barcode scanner service', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var scanner = createScannerMock(deferred);
        var server = createServerMock($q.defer());

        $controller('CheckinController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.device).toBeUndefined();
        expect(unit.guid).toBeUndefined();

        deferred.resolve({text: '012345679'}); $rootScope.$digest();

        expect(unit.guid).toBe('012345679');
        expect(scanner.scan).toHaveBeenCalled();
    }));

    it('should send a checkin device request', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var server = createServerMock(deferred);

        $controller('CheckinController', {$scope: unit, $cordovaBarcodeScanner: createScannerMock($q.defer()), serverService: server});

        unit.guid = '123456';

        unit.checkin();
        expect(server.checkin).toHaveBeenCalledWith('123456');

        expect(unit.device).toBeUndefined();
        deferred.resolve({name: 'iphone', checkin: true});
        $rootScope.$digest();
        expect(unit.device).toEqual({name: 'iphone', checkin: true});
    }));

    it('should do nothing if the scan is cancelled', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock($q.defer());

        $controller('CheckinController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        scannerDeferred.resolve({cancelled: true});
        $rootScope.$digest();

        expect(server.checkin).not.toHaveBeenCalled();
    }));

    it('should clear the scope at startup', angular.mock.inject(function($controller, $q, $rootScope) {
        var scanner = createScannerMock($q.defer());
        var server = createServerMock($q.defer());

        unit.device = {};
        unit.error = "";
        unit.guid = "";

        $controller('CheckinController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.device).toBeUndefined();
        expect(unit.guid).toBeUndefined();
        expect(unit.error).toBeUndefined();
    }));

});