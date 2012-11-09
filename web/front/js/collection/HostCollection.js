/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');

    var Host = Backbone.Collection.extend({
        model: require('../model/HostModel'),

        url: 'weibo/hosts'
    });

    return Host;
});

