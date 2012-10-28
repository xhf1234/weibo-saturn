/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var User = function (uid, name) {
        this.uid = uid;
        this.name = name;
    };
    User.prototype.toString = function () {
        return 'uid:' + this.uid + ', name:' + this.name;
    };
    exports.User = User;
}());
