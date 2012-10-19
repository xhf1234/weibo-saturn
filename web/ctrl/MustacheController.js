/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var MustacheController = require('../Controller').extend();

    MustacheController.prototype.match = function (path, method) {
        if (method !== 'GET') {
            return false;
        }
        var re = new RegExp('\\.mustache\\.js$');
        return re.test(path);
    };

    MustacheController.prototype.onRequest = function (req, resp) {
        console.log('MustacheController.OnRequest');
        var path = require('../HttpUtils').getPath(req);
        require('../HttpUtils').serveMustache(req, resp, path.substr(0, path.length - 3));
    };

    new MustacheController().init();
}());
