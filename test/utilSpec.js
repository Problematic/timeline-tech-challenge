define([
    'util'
], function (util) {
    describe('util', function () {
        var data = {
            firstName: 'Zaphod'
        };

        var event = {
            age: 42,
            content: 'became a hoopy frood'
        };

        describe('#buildEventString', function () {
            it('should return a string in format specified by docs', function () {
                expect(util.buildEventString(data, event)).toBe('At age 42, Zaphod became a hoopy frood.');
            });
        });

        describe('#buildEventEl', function () {
            it('should return an event string wrapped in a .timeline-event element', function () {
                expect(util.buildEventEl(data, event)).toBe('<p class="timeline-event">At age 42, Zaphod became a hoopy frood.</p>');
            });
        });
    });
});
