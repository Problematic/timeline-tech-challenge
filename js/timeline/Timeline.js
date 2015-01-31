define(['./Signal'], function (Signal) {
    function Timeline () {
        var timeline = [];

        for (var prop in Timeline.prototype) {
            if (Timeline.prototype.hasOwnProperty(prop)) {
                timeline[prop] = Timeline.prototype[prop];
            }
        }

        timeline.events = {};
        timeline.onPlay = new Signal();
        timeline.onUpdate = new Signal();
        timeline.onPause = new Signal();
        timeline.onFinish = new Signal();
        timeline.onRestart = new Signal();

        return timeline;
    }

    Timeline.State = {
        PAUSED: 0,
        PLAYING: 1,
        FINISHED: 2
    };

    Timeline.prototype = {
        scrubber: 0,
        duration: 0,
        state: Timeline.State.PAUSED,
        add: function (event, at) {
            event.$timelineAt = at;
            this.push(event);
            this.events[at] = event;
            this.duration = Math.max(this.duration, at);
        },
        at: function (t) {
            if (this.events[t]) {
                return this.events[t];
            }

            var current = -1;
            for (var timestamp in this.events) {
                if (this.events.hasOwnProperty(timestamp)) {
                    timestamp = parseInt(timestamp, 10);
                    if (timestamp < t && timestamp > current) {
                        current = timestamp;
                    }
                }
            }

            return this.events[current];
        },
        indexAt: function (t) {
            return this.indexOf(this.at(t));
        },

        play: function () {
            this.state = Timeline.State.PLAYING;
            this.onPlay.dispatch();
        },
        pause: function () {
            this.state = Timeline.State.PAUSED;
            this.onPause.dispatch();
        },
        restart: function () {
            this.scrubber = 0;
            this.state = Timeline.State.PLAYING;
            this.onRestart.dispatch();
        },
        finish: function () {
            this.state = Timeline.State.FINISHED;
            this.onFinish.dispatch();
        },

        update: function (dt) {
            if (this.state === Timeline.State.PLAYING) {
                this.scrubber += dt;
                this.scrubber = Math.min(this.scrubber, this.duration);

                this.onUpdate.dispatch();

                if (this.scrubber === this.duration) {
                    this.finish();
                }
            }
        }
    };

    return Timeline;
});
