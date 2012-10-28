/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var $ = window.jQuery.noConflict();
    var RelationForm = require('/view/RelationForm');

    var relationForm = new RelationForm();
    relationForm.$('input.nick-name').focus();
});
