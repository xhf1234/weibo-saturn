/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');
    var PageData = require('/util/PageData');
    var user = PageData.get('user');
    var friends = PageData.get('friends');
    var $ = require('/lib/jquery');

    var randomSelect = function (array, limit) {
        if (limit >= array.length) {
            return array;
        }
        var result = [];
        var i = 0;
        var r = null;
        var t = null;
        var remain = array.length;
        while (i !== limit) {
            r = Math.floor((Math.random() * remain));
            result.push(array[r]);
            //swap
            t = array[r];
            array[r] = array[remain - 1];
            array[remain - 1] = t;

            i = i + 1;
            remain = remain - 1;
        }
        return result;
    };

    var expand = function (user, friends) {
        friends = randomSelect(friends, 5);
        friends.forEach(function (friend) {
            Arbor.addNode(friend.uid, friend);
            Arbor.addEdge(user.uid, friend.uid);
        });
    };

    Arbor.addNode(user.uid, user);
    expand(user, friends);
    Arbor.setClickCallback(function (user) {
        $.getJSON('/weibo/expand', {
            uid: user.uid
        }, function (friends) {
            expand(user, friends);
        });
    });

/*
    // add some nodes to the graph and watch it go...
    Arbor.addEdge('a', 'b');
    Arbor.addEdge('a', 'c');
    Arbor.addEdge('a', 'd');
    Arbor.addEdge('a', 'e');
    Arbor.addNode('f', {alone : true, mass : 0.25});
    */
});
