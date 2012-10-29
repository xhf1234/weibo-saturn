/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');
    var PageData = require('/util/PageData');
    var user = PageData.get('user');
    var friends = PageData.get('friends');
    var $ = require('/lib/jquery');

    var i, j;
    friends.push(user);
    friends.forEach(function (user) {
        Arbor.addNode(user.uid, user);
    });
    for (i = 0; i < friends.length; i = i + 1) {
        for (j = i + 1; j < friends.length; j = j + 1) {
            Arbor.addEdge(friends[i].uid, friends[j].uid);
        }
    }
});
