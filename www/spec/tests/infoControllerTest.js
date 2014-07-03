describe('Info Controller', function() {

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
        var server = jasmine.createSpyObj('server', ['getDevice']);
        server.getDevice.and.returnValue(deferred.promise);
        return server;
    };

    it('should get GUID code from barcode scanner service', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var scanner = createScannerMock(deferred);
        var server = createServerMock($q.defer());

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.guid).toBeUndefined();

        deferred.resolve({text: '012345679'}); $rootScope.$digest();

        expect(unit.guid).toBe('012345679');
        expect(scanner.scan).toHaveBeenCalled();
    }));

    it('should set device data when retrieved from the server', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer(), serverDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock(serverDeferred);

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.guid).toBeUndefined();

        scannerDeferred.resolve({text: '012345679'});
        serverDeferred.resolve({name: 'iphone'});
        $rootScope.$digest();

        expect(unit.device).toEqual({name: 'iphone'});
        expect(server.getDevice).toHaveBeenCalledWith('012345679');
    }));

    it('should set the error string if something goes wrong scanning', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer(), serverDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock(serverDeferred);

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.error).toBeUndefined();
        
        scannerDeferred.reject('Some error');
        $rootScope.$digest();

        expect(unit.error).toEqual('Some error');
        expect(server.getDevice).not.toHaveBeenCalled();
    }));

    it('should set the error string if something goes wrong fetching the device', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer(), serverDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock(serverDeferred);

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        expect(unit.error).toBeUndefined();
        
        scannerDeferred.resolve({text: '012345679'});
        serverDeferred.reject('Some error');
        $rootScope.$digest();

        expect(unit.error).toEqual('Some error');        
    }));

    it('should go back to the root if the scan is cancelled', angular.mock.inject(function($controller, $q, $rootScope, $location) {
        var scannerDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);
        var server = createServerMock($q.defer());

        expect($location.url()).toBe('');

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});
        
        scannerDeferred.resolve({cancelled: true});        
        $rootScope.$digest();

        expect($location.url()).toBe('/'); 
        expect(server.getDevice).not.toHaveBeenCalled();
    }));

});