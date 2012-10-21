/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var WeiboController = require('../Controller').extend('weibo');

    var Handler = require('./Handler');
    var GetUserHandler = Handler.extend('user', 'GET');
    GetUserHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var uid = params.uid;
        var Store = require('../Store');
        Store.getUser(uid, function (error, user) {
            resp.writeHead(200, { 'Content-Type': 'application/json'});
            resp.end(JSON.stringify(user), 'utf-8');
        });
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new GetUserHandler());
    ctrl.init();
}());
