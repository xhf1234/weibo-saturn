/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = window.Backbone;

    var Form = Backbone.View.extend({
        el: 'form#form-clique',

        events: {
            'click .btn-submit': 'onSubmit'
        },

        initialize: function () {
            var form = this;
            this.$('.nick-name').keyup(function (e) {
                if (e.which === 13) {
                    form.onSubmit();
                }
            });
        },

        onSubmit: function (evt) {
            evt.preventDefault();
            var name = this.$('.nick-name').val();
            if (!name) {
                alert('请输入昵称');
            } else {
                window.location = 'weibo/clique?name=' + name;
            }
        }
    });

    return Form;
});
