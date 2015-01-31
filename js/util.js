define([], function () {
    return {
        buildEventEl: function (data, event) {
            return '<p class="timeline-event">At age {age}, {firstName} {event}.</p>'
                .replace('{age}', event.age)
                .replace('{firstName}', data.firstName)
                .replace('{event}', event.content);
        }
    };
});
