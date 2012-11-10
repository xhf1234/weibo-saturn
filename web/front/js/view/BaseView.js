/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = require('../lib/backbone');
    
    var BaseView = Backbone.View.extend({

        tmpl: null,

        template : function (data) {
            var handlebars = require('../lib/handlebars');
            var template = handlebars.compile(this.tmpl.template);
            data = template(data);
            console.log('data = ' + data);
        }
    });
    
    return BaseView;
});

