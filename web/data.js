/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var User = function (uid, name) {
        this.uid = uid;
        this.name = name;
    };
    exports.User = User;
}());
