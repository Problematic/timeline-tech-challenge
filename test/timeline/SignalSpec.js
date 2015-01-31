define([
    'timeline/Signal'
], function (Signal) {
    describe('Signal', function () {
        var signal;
        var asyncFlag;
        var callCount;
        beforeEach(function () {
            signal = new Signal();
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

        it('should call the provided handler when dispatched', function () {
            runs(function () {
                signal.add(signalHandler);
                signal.dispatch();
            });

            waitsFor(waitLatch, 'signal to be dispatched', 250);

            runs(function () {
                expect(callCount).toBe(1);
            });
        });

        it('should accept multiple handlers', function () {
            runs(function () {
                signal.add(function () {
                    callCount++;
                });
                signal.add(signalHandler);
                signal.dispatch();
            });

            waitsFor(waitLatch, 'signal to be dispatched', 250);

            runs(function () {
                expect(callCount).toBe(2);
            });
        });

        it('should be able to remove handlers', function () {
            runs(function () {
                signal.add(signalHandler);
                var handler = function () {
                    callCount++;
                };
                signal.add(handler);
                signal.remove(handler);
                signal.dispatch();
            });

            waitsFor(waitLatch, 'signal to be dispatched', 250);

            runs(function () {
                expect(callCount).toBe(1);
            });
        });

        it('should be able to assign a context to a handler', function () {
            var context = {
                foo: 'bar'
            };

            runs(function () {
                signal.add(function () {
                    this.foo = 'quux';
                    asyncFlag = true;
                }, context);
                signal.dispatch();
            });

            waitsFor(waitLatch, 'signal to be dispatched', 250);

            runs(function () {
                expect(context.foo).toBe('quux');
            });
        });

        it('should properly clean up contexts as well as handlers upon removal', function () {
            var ctx1 = {
                dispatched: false
            };
            var ctx2 = {
                dispatched: false
            };
            runs(function () {
                var first = function () {
                    this.bug = true;
                    asyncFlag = true;
                };
                signal.add(first, ctx1);
                signal.add(function () {
                    this.dispatched = true;
                    asyncFlag = true;
                }, ctx2);
                signal.remove(first);
                signal.dispatch();
            });

            waitsFor(waitLatch, 'signal to be dispatched', 250);

            runs(function () {
                expect(ctx1.bug).not.toBeDefined();
                expect(ctx1.dispatched).toBe(false);
                expect(ctx2.dispatched).toBe(true);
            });
        });
    });
});
