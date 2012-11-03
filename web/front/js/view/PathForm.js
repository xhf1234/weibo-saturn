/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Backbone = window.Backbone;

    var Form = Backbone.View.extend({
        el: 'div#form-path',

        events: {
            'click .btn-submit': 'onSubmit'
        },

        initialize: function () {
            var form = this;
            this.$('.nick-name').keyup(function (e) {
                if (e.which === 13) {
                    form.$('.btn-submit').click();
                }
            });
        },

        onSubmit: function () {
            var srcName = this.$('.src-name').val();
            var dstName = this.$('.dst-name').val();
            if (!srcName) {
                alert('请输入源用户昵称');
            } else {
                if (!dstName) {
                    alert('请输入目的用户昵称');
                } else {
                    window.location = 'weibo/path?src=' + srcName + '&dst=' + dstName;
                }
            }
        }
    });

    return Form;
});
