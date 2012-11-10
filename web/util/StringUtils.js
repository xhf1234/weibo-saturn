/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    exports.endWith = function (str, end) {
        var pattern = new RegExp('[.]*' + end.replace('.', '[\\.]') + '$');
        return pattern.test(str);
    };
}());
