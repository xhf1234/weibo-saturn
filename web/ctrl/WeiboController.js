/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var WeiboController = require('../Controller').extend('weibo');

    var Handler = require('./Handler');

    var onError = function (req, resp, error) {
        resp.writeHead(500);
        resp.end(error, 'utf-8');
    };

    /* weibo/user/uid={uid} */
    var GetUserHandler = Handler.extend('user', 'GET');
    GetUserHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var uid = params.uid;
        var Store = require('../Store');
        Store.getUser(uid, function (error, user) {
            if (error) {
                onError(req, resp, error);
            } else {
                resp.writeHead(200, { 'Content-Type': 'application/json'});
                resp.end(JSON.stringify(user), 'utf-8');
            }
        });
    };

    var InitHandler = Handler.extend(null, 'GET');
    InitHandler.prototype.handle = function (req, resp) {
        var uid = require('../Const').initUid;
        var Store = require('../Store');
        var path = require('path');
        var tpl_base = path.normalize(__dirname + '/../front/html');
        Store.getUser(uid, function (error, user) {
            if (error) {
                onError(req, resp, error);
            } else {
                var view = require('liteview');
                view.init(tpl_base);
                view.debug(true);
                var data = {};
                data.user = JSON.stringify(user);
                Store.getFriends(uid, function (error, friends) {
                    if (error) {
                        onError(req, resp, error);
                    } else {
                        data.friends = JSON.stringify(friends);
                        var html = view.render('weibo.html', data);
                        resp.writeHead(200, { 'Content-Type': 'text/html'});
                        resp.end(html, 'utf-8');
                    }
                });
            }
        });
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new GetUserHandler());
    ctrl.addHandler(new InitHandler());
    ctrl.init();
}());
