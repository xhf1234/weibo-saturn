/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var Controller = function () {
    };

    Controller.prototype.init = function () {
        require('./Dispatcher').register(this);
    };

    Controller.prototype.onRequest = function (req, resp) {
        this._handlers = this._handlers || [];
        var path = require('./HttpUtils').getPath(req);
        var method = req.method;
        this._handlers.forEach(function (handler) {
            if (handler.match(path, method)) {
                try {
                    handler.handle(req, resp);
                } catch (error) {
                    console.error(error);
                }
            }
        }, this);
    };

    Controller.prototype.match = function (path, method) {
        this._handlers = this._handlers || [];
        return this._handlers.some(function (handler) {
            return handler.match(path, method);
        }, this);
    };

    Controller.prototype.addHandler = function (handler) {
        handler.controller = this;
        this._handlers = this._handlers || [];
        this._handlers.push(handler);
    };

    exports.extend = function (path) {
        var SubController = function () {
            this.path = path;
        };
        SubController.prototype = new Controller();
        return SubController;
    };
}());
