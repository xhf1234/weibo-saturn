/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    require('./Bootstrap').ready(function () {
        var Data = require('./data');
        var Graph = Data.Graph;
        var Edge = Data.Edge;
        var a = [1, 2, 3, 4, 5, 6];
        var b = [[2, 5], [3, 4,  5], [4, 5], [5, 6], [], []];
        var G = Data.makeGraph(a, b);
        console.log('G = ' + G);
        G = G.maxClique2();
        console.log('G = ' + G);
    });
}());
