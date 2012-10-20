/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var Handler = function () {
    };
    Handler.prototype.match = function (path, method) {
        return this.check(path, method);
    };
    Handler.prototype.handle = function (req, resp) {
        //abstract method
    };
    Handler.prototype.checkPath = function (path) {
        var mypath = this.controller.path;
        if (this.path) {
            mypath = mypath + '/' + this.path;
        }
        return path === mypath;
    };
    Handler.prototype.checkMethod = function (method) {
        return this.method === method;
    };
    Handler.prototype.check = function (path, method) {
        return this.checkPath(path) && this.checkMethod(method);
    };

    exports.extend = function (path, method) {
        var SubHandler = function () {
            this.path = path;
            this.method = method;
        };
        SubHandler.prototype = new Handler();
        return SubHandler;
    };
}());
