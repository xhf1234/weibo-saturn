/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');
    var PageData = require('/util/PageData');
    var user = PageData.get('user');
    var friends = PageData.get('friends');

    Arbor.addNode(user.uid, user);
    friends.forEach(function (friend) {
        Arbor.addNode(friend.uid, friend);
        Arbor.addEdge(user.uid, friend.uid);
    });
    Arbor.setClickCallback(function (user) {
        console.log(user.name);
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
