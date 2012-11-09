/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var Host = function (uid, name, fansCount, verify, avatar, url) {
        this.uid = uid;
        this.name = name;
        this.fansCount = fansCount;
        this.verify = verify;
        this.avatar = avatar;
        this.url = url;
    };
    Host.prototype.toString = function () {
        return 'uid:' + this.uid + ', name:' + this.name + ', fansCount: ' + this.fansCount + ', verify: ' + this.verify + ', avatar: ' + this.avatar + ', url: ' + this.url;
    };
    module.exports = Host;
    
}());
