/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');
    var PageData = require('/util/PageData');
    var user = PageData.get('user');
    var friends = PageData.get('friends');
    var $ = require('/lib/jquery');

    var cache = {};
    cache.add = function (uid, friends) {
        var data = {
            friends: friends,
            index: 0
        };
        this[uid] = data;
    };
    var randomSort = function (array) {
        var size = array.length;
        var t = null;
        var rd = null;
        while (size > 1) {
            rd = Math.round(Math.random() * size);
            if (rd < size) {
                t = array[rd];
                array[rd] = array[size - 1];
                array[size - 1] = t;
            }
            size = size - 1;
        }
    };
    randomSort(friends);
    cache.add(user.uid, friends);
    var expand = function (user) {
        var data = cache[user.uid];
        var friends = data.friends;
        var index = data.index;
        var friend = null;
        while (index < friends.length && index - data.index < 5) {
            friend = friends[index];
            Arbor.addNode(friend.uid, friend);
            Arbor.addEdge(user.uid, friend.uid);
            index = index + 1;
        }
        data.index = index;
    };

    Arbor.addNode(user.uid, user);
    expand(user);
    Arbor.setClickCallback(function (user) {
        if (cache[user.uid]) {
            expand(user);
        } else {
            $.getJSON('/weibo/expand', {
                uid: user.uid
            }, function (friends) {
                randomSort(friends);
                cache.add(user.uid, friends);
                expand(user);
            });
        }
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
