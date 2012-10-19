/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = window.Backbone;

    var Button = Backbone.View.extend({
        el: 'input#submit',
        events: {
            'click': 'onSubmit'
        },

        onSubmit: function () {
            alert('submit');
        }
    });

    return Button;
});
