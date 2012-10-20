/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var controllers = [];
    exports.register = function (controller) {
        controllers.push(controller);
    };

    exports.dispatch = function (req, resp) {
        var path = require('./HttpUtils').getPath(req);
        console.log('dispatch path=' + path);

        var handled = controllers.some(function (controller) {
            if (controller.match(path, req.method)) {
                controller.onRequest(req, resp);
                return true;
            }
            return false;
        }, this);
        if (!handled) {
            var extname = require('path').extname(path);
            switch (extname) {
            case '':
                require('./HttpUtils').serveHtml(req, resp, path + '.html');
                handled = true;
                break;
            case '.html':
                require('./HttpUtils').serveHtml(req, resp, path);
                handled = true;
                break;
            case '.js':
                require('./HttpUtils').serveJs(req, resp, path);
                handled = true;
                break;
            case '.less':
                require('./HttpUtils').serveLess(req, resp, path);
                handled = true;
                break;
            }
        }
        if (!handled) {
            resp.writeHead(404);
            resp.write('404');
            resp.end();
        }
    };
    
}());
