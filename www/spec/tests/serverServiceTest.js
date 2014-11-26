describe('Server Service', function() {

    var unit, httpBackend;

    beforeEach(module('odl'));

    beforeEach(inject(function (serverService, $httpBackend) {
        unit = serverService;
        httpBackend = $httpBackend;
    }));

    it('should retrieve a device given the encoded GUID', function() {
        httpBackend.expect('GET', 'http://odl.herokuapp.com/api/device/0000').respond({name: 'MOTO G'});
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.getDevice('0000').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.ok).toHaveBeenCalledWith({name: 'MOTO G'});
        expect(promise.error).not.toHaveBeenCalled();
    });

    it('should call the error function if we get an error from the server', function() {
        httpBackend.expect('GET', 'http://odl.herokuapp.com/api/device/0001').respond(404, 'Device not found');
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.getDevice('0001').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.error).toHaveBeenCalledWith('Device not found');
        expect(promise.ok).not.toHaveBeenCalled();
    });

    it('should retrieve a device given the encoded GUID and calling to add device', function(){
        httpBackend.expect('POST', 'http://odl.herokuapp.com/api/device', JSON.stringify({guid: '0000', imei: 'imei', humanId: 'uknumber'})).respond({name: 'MOTO G', guid: '0000'});
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.addDevice('0000','imei','uknumber').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.ok).toHaveBeenCalledWith({name: 'MOTO G', guid: '0000'});
        expect(promise.error).not.toHaveBeenCalled();
    });

    it('should retrieve a device given the encoded GUID and calling to checkin device', function(){
        httpBackend.expect('POST', 'http://odl.herokuapp.com/api/check/in/0000').respond({name: 'MOTO G', guid: '0000', checkin: true});
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.checkin('0000').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.ok).toHaveBeenCalledWith({name: 'MOTO G', guid: '0000', checkin: true});
        expect(promise.error).not.toHaveBeenCalled();
    });

    it('should retrieve a device given the encoded GUID and calling to checkout device', function(){
        httpBackend.expect('POST', 'http://odl.herokuapp.com/api/check/out/0000').respond({name: 'MOTO G', guid: '0000', checkin: false});
        var promise = jasmine.createSpyObj('promise', ['ok', 'error']);
        unit.checkout('0000').then(promise.ok, promise.error);
        httpBackend.flush();
        expect(promise.ok).toHaveBeenCalledWith({name: 'MOTO G', guid: '0000', checkin: false});
        expect(promise.error).not.toHaveBeenCalled();
    });
});
