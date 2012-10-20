/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Arbor = require('/lib/arbor');

    // add some nodes to the graph and watch it go...
    Arbor.addEdge('a', 'b');
    Arbor.addEdge('a', 'c');
    Arbor.addEdge('a', 'd');
    Arbor.addEdge('a', 'e');
    Arbor.addNode('f', {alone : true, mass : 0.25});
});
