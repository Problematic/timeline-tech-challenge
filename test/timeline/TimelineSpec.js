define([
    'timeline/Timeline'
], function (Timeline) {
    describe('Timeline', function () {
        var timeline;
        beforeEach(function () {
            timeline = new Timeline();
            timeline.play();
        });

        describe('constructor', function () {
            it('should return an array-like object', function () {
                expect(Array.isArray(timeline)).toBe(true);
            });

            it('should be empty by default', function () {
                expect(timeline.length).toBe(0);
            });
        });

        describe('defaults', function () {
            it('to "paused" state', function () {
                var timeline = new Timeline();
                expect(timeline.state).toBe(Timeline.State.PAUSED);
            });

            it('to 0 duration', function () {
                expect(timeline.duration).toBe(0);
            });
        });

        describe('#add', function () {
            it('should extend the duration', function () {
                timeline.add({}, 5);
                expect(timeline.duration).toBe(5);
            });

            it('should never reduce the duration', function () {
                timeline.add({}, 10);
                timeline.add({}, 2);
                expect(timeline.duration).toBe(10);
            });

            it('should increase the length', function () {
                timeline.add({}, 5);
                timeline.add({}, 10);
                expect(timeline.length).toBe(2);
                timeline.add({}, 15);
                expect(timeline.length).toBe(3);
            });
        });

        describe('duration', function () {
            it('can be manually set', function () {
                timeline.duration = 30;
                timeline.add({}, 15);
                expect(timeline.duration).toBe(30);
            });
        });

        describe('#update', function () {
            it('takes a delta time and increments scrubber by that amount', function () {
                timeline.duration = 1.25;
                timeline.update(1);
                expect(timeline.scrubber).toBe(1);
                timeline.update(0.25);
                expect(timeline.scrubber).toBe(1.25);
            });

            it('will only update scrubber if state is playing', function () {
                timeline.duration = 5;
                timeline.update(5);
                timeline.pause();
                timeline.update(1);
                expect(timeline.scrubber).toBe(5);
            });

            it('limits upper bound of scrubber to duration', function () {
                timeline.duration = 5;
                timeline.update(6);
                expect(timeline.scrubber).toBe(5);
            });

            it('should transition to finished state when scrubber === duration', function () {
                timeline.duration = 10;
                timeline.update(10);
                expect(timeline.state).toBe(Timeline.State.FINISHED);
            });
        });

        describe('signals', function () {
            var asyncFlag;
            var callCount;
            var timeline;
            beforeEach(function () {
                timeline = new Timeline();
                asyncFlag = false;
                callCount = 0;
            });

            function signalHandler () {
                asyncFlag = true;
                callCount++;
            }

            function waitLatch () {
                return asyncFlag;
            }

            describe('#onPlay', function () {
                it('should be dispatched after timeline#play is called', function () {
                    runs(function () {
                        timeline.onPlay.add(signalHandler);
                        timeline.play();
                    });

                    waitsFor(waitLatch, 'timeline#onPlay to be dispatched', 250);
                });
            });
            describe('#onUpdate', function () {
                it('should be dispatched after timeline#update is called', function () {
                    runs(function () {
                        timeline.onUpdate.add(signalHandler);
                        timeline.duration = 10;
                        timeline.play();
                        timeline.update(5);
                        timeline.update(10);
                    });

                    waitsFor(waitLatch, 'timeline#onUpdate to be dispatched', 250);

                    runs(function () {
                        expect(callCount).toBe(2);
                    });
                });
            });
            describe('#onPause', function () {
                it('should be dispatched after timeline#pause is called', function () {
                    runs(function () {
                        timeline.onPause.add(signalHandler);
                        timeline.pause();
                    });

                    waitsFor(waitLatch, 'timeline#onPause to be dispatched', 250);
                });
            });
            describe('#onFinish', function () {
                it('should be dispatched after timeline#finish is called', function () {
                    runs(function () {
                        timeline.onFinish.add(signalHandler);
                        timeline.finish();
                    });

                    waitsFor(waitLatch, 'timeline#onFinish to be dispatched', 250);
                });

                it('shold be dispatched automatically on update where scrubber reaches duration', function () {
                    runs(function () {
                        timeline.onFinish.add(signalHandler);
                        timeline.duration = 5;
                        timeline.play();
                        timeline.update(5);
                    });

                    waitsFor(waitLatch, 'timeline#onFinish to be dispatched after update', 250);
                });
            });
            describe('#onRestart', function () {
                it('should be dispatched after timeline#restart is called', function () {
                    runs(function () {
                        timeline.onRestart.add(signalHandler);
                        timeline.restart();
                    });

                    waitsFor(waitLatch, 'timeline#onRestart to be dispatched', 250);
                });
            });

            it('should dispatch #onUpdate followed by #onFinish when updated to duration', function () {
                runs(function () {
                    timeline.onUpdate.add(signalHandler);
                    timeline.onFinish.add(signalHandler);
                    timeline.duration = 10;
                    timeline.play();
                    timeline.update(10);
                });

                waitsFor(waitLatch, 'timeline#update to be called', 250);

                runs(function () {
                    expect(callCount).toBe(2);
                });
            });
        });

        describe('control methods', function () {
            describe('#play', function () {
                it('has no effect when timeline is already playing', function () {
                    expect(timeline.state).toBe(Timeline.State.PLAYING);
                    timeline.play();
                    expect(timeline.state).toBe(Timeline.State.PLAYING);
                });
            });

            describe('#pause', function () {
                it('changes state to paused from playing', function () {
                    timeline.pause();
                    expect(timeline.state).toBe(Timeline.State.PAUSED);
                });
            });

            describe('#restart', function () {
                it('changes state to playing and resets scrubber to 0', function () {
                    timeline.pause();
                    timeline.scrubber = 50;
                    timeline.restart();
                    expect(timeline.state).toBe(Timeline.State.PLAYING);
                    expect(timeline.scrubber).toBe(0);
                });
            });

            describe('#finish', function () {
                it('changes state to finished', function () {
                    timeline.finish();
                    expect(timeline.state).toBe(Timeline.State.FINISHED);
                });

                it('does not modify scrubber value', function () {
                    timeline.duration = 5;
                    timeline.update(5);
                    timeline.finish();
                    expect(timeline.scrubber).toBe(5);
                });
            });
        });
    });
});
