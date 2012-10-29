/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var $ = window.jQuery.noConflict();
    var RelationForm = require('/view/RelationForm');
    var CliqueForm = require('/view/CliqueForm');

    var relationForm = new RelationForm();
    var cliqueForm = new CliqueForm();

    relationForm.$('input.nick-name').focus();
});
