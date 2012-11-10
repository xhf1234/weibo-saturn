/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var $ = require('./lib/jquery');
    var HostList = require('./view/HostList');

    var list = new HostList({
        el: '.host-list-wrap'
    });
    list.render();
});

