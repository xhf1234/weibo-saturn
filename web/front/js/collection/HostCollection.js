/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');

    var Host = Backbone.Collection.extend({
        model: require('../model/HostModel'),

        url: 'weibo/hosts',

        loadPage: function (page, callback) {
            var options = {
                data: {page: page},
                success: callback
            };
            this.fetch(options);
        }
    });

    return Host;
});

