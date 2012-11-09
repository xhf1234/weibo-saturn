/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var handlebars = require('handlebars');

    handlebars.render = function (template, data) {
        if (typeof template !== 'string') {
            template = template.toString();
        }
        template = handlebars.compile(template);
        return template(data);
    };

    handlebars.renderFile = function (file, data) {
        var template = require('fs').readFileSync(require('path').normalize(__dirname + '/../front/template/' + file), 'UTF-8');
        var pageName = require('path').basename(file, '.handlebars');
        data = data || {};
        data.pageName = data.pageName || pageName;
        return handlebars.render(template, data);
    };

    var getPartial = function (file) {
        return require('fs').readFileSync(require('path').normalize(__dirname + '/../front/template/partial/' + file), 'UTF-8');
    };
    var registerPartial = function (name, file) {
        handlebars.registerPartial(name, getPartial(file));
    };

    registerPartial('header', 'head.handlebars');
    registerPartial('footer', 'foot.handlebars');

    module.exports = handlebars;
}());
