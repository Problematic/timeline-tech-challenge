define([], function () {
    return {
        buildEventString: function (data, event) {
            return 'At age {age}, {firstName} {event}.'
                .replace('{age}', event.age)
                .replace('{firstName}', data.firstName)
                .replace('{event}', event.content);
        },
        buildEventEl: function (data, event) {
            return '<p class="timeline-event">' + this.buildEventString(data, event) + '</p>';
        }
    };
});
