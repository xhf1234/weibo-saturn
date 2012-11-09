/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var HostCollection = require('./collection/HostCollection');
    var collection = new HostCollection();
    var options = {
        data: {page: 0},
        success: function (collection, response) {
            var hosts = collection.toJSON();
        }
    };
    collection.fetch(options);
});

