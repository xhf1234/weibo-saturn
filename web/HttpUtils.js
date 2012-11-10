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

    exports.serveHandlebars = function (req, resp, file) {
        file = __dirname + '/front/template/' + file;
        require('fs').readFile(file, function (error, content) {
            if (error) {
                console.error(error);
                resp.writeHead(404);
                resp.end('404, read file error:' + file);
            } else {
                var pageName = require('path').basename(file, '.handlebars');
                var handlebars = require('./lib/handlebars');
                content = handlebars.render(content, {pageName: pageName});
                resp.writeHead(200, { 'Content-Type': 'text/html'});
                resp.end(content, 'utf-8');
            }
        });
    };

    exports.serveHtml  = function (req, resp, file) {
        serveFile(req, resp, 'front/html/' + file, 'text/html');
    };

    exports.serveLess = function (req, resp, file) {
        serveFile(req, resp, 'front/less/' + file, 'text/css');
    };

    exports.serveCss = function (req, resp, file) {
        serveFile(req, resp, 'front/css/' + file, 'text/css');
    };

    exports.serveJs = function (req, resp, file) {
        serveFile(req, resp, 'front/js/' + file, 'text/javascript');
    };

    exports.serveHandlebarsJs = function (req, resp, file) {
        file = __dirname + '/front/template/' + file;
        require('fs').readFile(file, function (error, content) {
            if (error) {
                console.error(error);
                resp.writeHead(404);
                resp.end('404, read file error:' + file);
            } else {
                content = content.toString();
                var output = {template: content};
                output = JSON.stringify(output);
                content = 'define(function (require, exports, module) {return ' + output + ';});';
                resp.writeHead(200, { 'Content-Type': 'text/javascript'});
                resp.end(content, 'utf-8');
            }
        });
    };
}());
