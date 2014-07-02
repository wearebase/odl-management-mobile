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
        var server = jasmine.createSpyObj('server', ['addDevice','getDevice']);
        server.getDevice.and.returnValue(deferred.promise);
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

});