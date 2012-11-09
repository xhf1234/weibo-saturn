/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var view = require('liteview');
    var path = require('path');
    var tpl_base = path.normalize(__dirname + '/../front/vm');
    view.init(tpl_base);
    view.debug(true);

    module.exports = view;
}());
