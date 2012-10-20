/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var WeiboController = require('../Controller').extend('weibo');

    var Handler = require('./Handler');
    var InitHandler = Handler.extend('init', 'GET');
    InitHandler.prototype.handle = function (req, resp) {
        var Store = require('../Store');
        var uid = 2207639514;
        Store.getUser(uid, function (user) {
            console.log(user);
        });
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new InitHandler());
    ctrl.init();
}());
