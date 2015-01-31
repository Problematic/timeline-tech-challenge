require([
    'jquery',
    'text!../timeline.json',
    'timeline/Timeline',
    'util'
], function ($, data, Timeline, util) {
    data = JSON.parse(data);

    $(function () {
        $container = $('.container');
        $scrubber = $('.scrubber');

        var stateToText = {};
        stateToText[Timeline.State.PLAYING] = 'Pause';
        stateToText[Timeline.State.PAUSED] = 'Play';
        stateToText[Timeline.State.FINISHED] = 'Restart';

        $playButton = $('.play-button');
        $playButton.on('click', function () {
            var prev = timeline.state;

            if (prev === Timeline.State.PLAYING) {
                $container.find('.timeline-event').addClass('timeline-paused');
                timeline.pause();
            } else if (prev === Timeline.State.PAUSED) {
                $container.find('.timeline-event').removeClass('timeline-paused');
                timeline.play();
            } else if (prev === Timeline.State.FINISHED) {
                timeline.restart();
            }

            $playButton.text(stateToText[timeline.state]);
        });

        var timeline = new Timeline(data.events.length);
        timeline.duration = data.age * 2;
        timeline.play();

        for (var i = 0; i < data.events.length; i++) {
            timeline.add(data.events[i], data.events[i].age * 2);
        }

        var index = -1;
        var $timelineEvent;
        timeline.onUpdate.add(function () {
            $scrubber.attr('value', timeline.scrubber);

            var timelineIndex = timeline.indexAt(timeline.scrubber);
            if (timelineIndex !== index) {
                index = timelineIndex;

                var $new = $(util.buildEventEl(data, timeline[index]));
                $container.append($new);
                $new.on('webkitAnimationEnd', function ($e) {
                    $(this).remove();
                });

                if ($timelineEvent) {
                    $timelineEvent.addClass('animate-out');
                }

                $timelineEvent = $new;
            }
        });

        timeline.onFinish.add(function () {
            $playButton.text('Restart');
        });

        $scrubber.attr('max', timeline.duration);

        var time = Date.now();
        function tick () {
            window.requestAnimationFrame(tick);

            var current = Date.now();
            var dt = (current - time) / 1000;
            time = current;

            timeline.update(dt);
        }
        window.requestAnimationFrame(tick);
    });
});
