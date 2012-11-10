/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var handlebars = require('handlebars');

    handlebars.createTemplate = function (template) {
        if (typeof template !== 'string') {
            template = template.toString();
        }
        return handlebars.compile(template);
    };

    handlebars.createTemplateFromFile = function (file) {
        var template = require('fs').readFileSync(require('path').normalize(__dirname + '/../front/template/' + file), 'UTF-8');
        return handlebars.createTemplate(template);
    };

    handlebars.render = function (template, data) {
        template = handlebars.createTemplate(template);
        return template(data);
    };

    handlebars.renderFile = function (file, data) {
        var pageName = require('path').basename(file, '.handlebars');
        data = data || {};
        data.pageName = data.pageName || pageName;
        var template = handlebars.createTemplateFromFile(file);
        return template(data);
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
