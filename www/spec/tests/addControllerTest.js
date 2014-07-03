describe('Add Device Controller', function() {

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
        var server = jasmine.createSpyObj('server', ['addDevice']);
        server.addDevice.and.returnValue(deferred.promise);
        return server;
    };

    it('should get GUID code from barcode scanner service', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var scanner = createScannerMock(deferred);
        var server = createServerMock($q.defer());

        $controller('AddController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.guid).toBeUndefined();

        deferred.resolve({text: '012345679'}); $rootScope.$digest();

        expect(unit.guid).toBe('012345679');
        expect(scanner.scan).toHaveBeenCalled();
    }));

    it('should send an add device request', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var server = createServerMock(deferred);

        unit.guid = '123456';
        unit.imei = 'imei number';
        unit.humanId = 'UK000';

        $controller('AddController', {$scope: unit, $cordovaBarcodeScanner: createScannerMock($q.defer()), serverService: server});

        unit.addDevice();
        expect(server.addDevice).toHaveBeenCalledWith('123456', 'imei number', 'UK000');

        expect(unit.device).toBeUndefined();
        deferred.resolve({name: 'iphone'});
        $rootScope.$digest();
        expect(unit.device).toEqual({name: 'iphone'});
    }));

    it('should do nothing if the scan is cancelled', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock($q.defer());

        $controller('AddController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});
        
        scannerDeferred.resolve({cancelled: true});        
        $rootScope.$digest();

        expect(server.addDevice).not.toHaveBeenCalled();
    }));

});