/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    require('./Bootstrap').ready(function () {
        var Data = require('./data');
        var Graph = Data.Graph;
        var friendIds = [1, 2, 3, 4];
        var friendIdsList = [[2], [4], [1], [1]];
        var G = Data.makeGraph(friendIds, friendIdsList);
        console.log('G = ' + G);
        console.log('Utils.isClique(G) = ' + G.isClique());
        var G2 = G.maxClique();
        console.log('G2 = ' + G2);
        console.log('Utils.isClique(G2) = ' + G2.isClique());
    });
}());
