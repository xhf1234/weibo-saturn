/*jslint browser: true, devel: true, indent: 4, nomen:true, vars: true */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Mustache = window.Mustache;
    var $ = window.jQuery.noConflict();
    var Button = require('/view/Button');
    var Arbor = window.arbor;

    var data = {
        title : 'aloha',
        url : 'http://www.fenbi.com'
    };
    var template = require('/aloha.mustache').template;
    var el = Mustache.render(template, data);
    $('div#aloha').append(el);

    var btn = new Button();

    var sys = Arbor.ParticleSystem();
});
