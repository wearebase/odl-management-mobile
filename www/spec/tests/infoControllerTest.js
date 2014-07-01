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

    it('should get GUID code from barcode scanner service', angular.mock.inject(function($controller, $q, $rootScope) {
        var deferred = $q.defer();
        var scanner = createScannerMock(deferred);
        expect(unit.guid).toBeUndefined();

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner});

        deferred.resolve('012345679'); $rootScope.$digest();

        expect(unit.guid).toBe('012345679');
        expect(scanner.scan).toHaveBeenCalled();
    }));

    it('should get device data when getServiceData is called', angular.mock.inject(function($controller, $q, $rootScope) {
        var scannerDeferred = $q.defer();
        var scanner = createScannerMock(scannerDeferred);

        var deferred = $q.defer();

        var server = jasmine.createSpyObj('server', ['getDevice']);
        server.getDevice.and.returnValue(deferred.promise);

        expect(unit.guid).toBeUndefined();

        $controller('InfoController', {$scope: unit, $cordovaBarcodeScanner: scanner, serverService: server});

        scannerDeferred.resolve('012345679');
        deferred.resolve({name: 'iphone'}); $rootScope.$digest();

        expect(unit.device).toEqual({name: 'iphone'});
        expect(server.getDevice).toHaveBeenCalledWith('012345679');
    }));

});