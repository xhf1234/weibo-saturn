/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    exports.get = function (id) {
        var $ = require('/lib/jquery');
        return JSON.parse($('#' + id).html());
    };
});

