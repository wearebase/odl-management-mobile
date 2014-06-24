describe('app', function() {
    describe('initialize', function() {
        it('should bind deviceready', function() {
            spyOn(app, 'onDeviceReady');
            app.initialize();
            helper.trigger(window.document, 'deviceready');           
            expect(app.onDeviceReady).toHaveBeenCalled();                        
        });
    });

    describe('onDeviceReady', function() {
        it('should report that it fired', function() {
            spyOn(app, 'receivedEvent');
            app.onDeviceReady();
            expect(app.receivedEvent).toHaveBeenCalledWith('deviceready');
        });
    });   
});
