/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');

    var BaseView = require('./BaseView');
    var HostItem = require('./HostItem');
    var HostCollection = require('../collection/HostCollection');
    
    var HostList = BaseView.extend({
        currentPage: null,

        initialize: function () {
            this.collection = new HostCollection();
        },

        render: function () {
            this.loadPage(0);
        },

        loadPage: function (page) {
            this.currentPage = page;
            this.collection.loadPage(page, this.doLoadPage.bind(this));
        },

        doLoadPage: function () {
            var hosts = this.collection.toJSON();
            hosts.forEach(function (host) {
                var item = new HostItem();
                item.render(host);
                this.$el.append(item.$el);
            }, this);
            
        }
    });
    
    return HostList;
});
