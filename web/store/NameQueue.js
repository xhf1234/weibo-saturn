/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var NameQueue = function () {
    };
    NameQueue.prototype = new BaseStore();

    NameQueue.prototype.key = function () {
        return 'wb:name:queue';
    };

    NameQueue.prototype.enqueueName = function (name) {
        var client = this.getClient();
        client.rpush(this.key(), name, function (error, result) {
            client.end();
        });
    };

    module.exports = NameQueue;
}());
