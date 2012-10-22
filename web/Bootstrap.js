/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    exports.ready = function (callback) {
        require('./Const').load(callback);
    };
}());
