/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');
    var PageData = require('/util/PageData');
    var $ = require('/lib/jquery');
    var users = PageData.get('users');

    users.forEach(function (user) {
        Arbor.addNode(user.uid, user);
    });
    var i;
    for (i = 1; i < users.length; i = i + 1) {
        Arbor.addEdge(users[i - 1].uid, users[i].uid);
    }
});
