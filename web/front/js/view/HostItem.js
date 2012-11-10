/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */

/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');

    var BaseView = require('./BaseView');
    
    var HostItem = BaseView.extend({
        tagName: 'li',

        className: 'host-item-wrap span2',

        tmpl: require('/weibo/host/HostItem.handlebars'),

        render: function (renderData) {
            this.el.innerHTML = this.template(renderData);
        }
    });
    
    return HostItem;
});
