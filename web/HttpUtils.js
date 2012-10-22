/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    exports.getPath = function (request) {
        return require('url').parse(request.url).pathname.substr(1);
    };

    exports.getParams = function (request) {
        return require('url').parse(request.url, true).query;
    };

    var serveFile = function (req, resp, file, type) {
        file = __dirname + '/' + file;
        console.log('serveFile ' + file + ',' + type);
        require('fs').readFile(file, function (error, content) {
            if (error) {
                console.error(error);
                resp.writeHead(404);
                resp.end('404, read file error:' + file);
            } else {
                resp.writeHead(200, { 'Content-Type': type});
                resp.end(content, 'utf-8');
            }
        });
    };

    exports.serveHtml = function (req, resp, file) {
        serveFile(req, resp, 'front/html/' + file, 'text/html');
    };

    exports.serveLess = function (req, resp, file) {
        serveFile(req, resp, 'front/less/' + file, 'text/css');
    };

    exports.serveJs = function (req, resp, file) {
        serveFile(req, resp, 'front/js/' + file, 'text/javascript');
    };

    exports.serveMustache = function (req, resp, file) {
        file = 'front/mustache/' + file;
        require('fs').readFile(file, function (error, content) {
            if (error) {
                resp.writeHead(404);
                resp.end('404, read file error:' + file);
            } else {
                var output = {
                    template: content.toString()
                };
                output = JSON.stringify(output);
                content = 'define(function (require, exports, module) {return  ' + output + ';});';
                resp.writeHead(200, { 'Content-Type': 'text/javascript'});
                resp.end(content, 'utf-8');
            }
        });
    };
}());
