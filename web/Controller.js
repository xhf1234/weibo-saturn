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
        //abstract method
    };

    Controller.prototype.match = function (path, method) {
        //abstract method
        return false;
    };

    exports.extend = function () {
        var SubController = function () {
        };
        SubController.prototype = new Controller();
        return SubController;
    };
}());
