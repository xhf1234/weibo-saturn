/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var WeiboController = require('../Controller').extend('weibo');

    var Handler = require('./Handler');
    var InitHandler = Handler.extend('init', 'GET');
    InitHandler.prototype.handle = function (req, resp) {
        console.log('handle');
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new InitHandler());
    ctrl.init();
}());
