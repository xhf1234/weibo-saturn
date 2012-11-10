/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */

/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');

    var BaseView = require('./BaseView');
    
    var HostItem = BaseView.extend({
        tagName: 'div',

        className: 'host-item-wrap',

        tmpl: require('/weibo/host/HostItem.handlebars'),

        render: function (renderData) {
            var data = {name: 'hello'};
            this.template(data);
        }
    });
    
    return HostItem;
});
