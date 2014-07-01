describe('Server Service', function() {

    var unit, httpBackend;

    beforeEach(module('odl'));

    beforeEach(inject(function (serverService, $httpBackend) {
        unit = serverService;
        httpBackend = $httpBackend;
        $httpBackend.when('GET', 'http://odl-uat.herokuapp.com/api/device/0000').respond({name: 'MOTO G'});
        $httpBackend.when('GET', 'http://odl-uat.herokuapp.com/api/device/0001').respond(404, 'Device not found');
    }));

    it('should retrieve a device given the encoded GUID', function() {
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.getDevice('0000').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.ok).toHaveBeenCalledWith({name: 'MOTO G'});
        expect(promise.error).not.toHaveBeenCalled();
    });

    it('should call the error function if we get an error from the server', function() {
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.getDevice('0001').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.error).toHaveBeenCalledWith('Device not found');
        expect(promise.ok).not.toHaveBeenCalled();
    });
});
