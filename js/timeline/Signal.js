define([], function () {
    function Signal () {
        this._contexts = [];
        this._handlers = [];
    }

    Signal.prototype = {
        add: function (handler, context) {
            this._handlers.push(handler);
            this._contexts.push(context || null);
        },
        remove: function (handler) {
            var idx = this._handlers.indexOf(handler);
            this._handlers.splice(idx, 1);
            this._contexts.splice(idx, 1);
        },
        dispatch: function () {
            for (var i = 0; i < this._handlers.length; i++) {
                this._handlers[i].apply(this._contexts[i], arguments);
            }
        }
    };

    return Signal;
});
