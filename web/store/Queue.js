/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var Queue = function () {
    };
    Queue.prototype = new BaseStore();

    Queue.prototype.key = function () {
        return 'wb:queue';
    };

    Queue.prototype.putQueueFront = function (uid, callback) {
        var client = this.getClient();
        client.zincrby(this.key(), 10000, uid, function (error, result) {
            client.end();
            if (callback) {
                callback(error, result);
            }
        });
    };

    Queue.prototype.putQueueFrontPipe = function (uids, callback) {
        var client = this.getClient();
        var multi = client.multi();
        uids.forEach(function (uid) {
            multi.zincrby(this.key(), 10000, uid);
        }, this);
        multi.exec(function (error, result) {
            client.end();
            if (callback) {
                callback(null, result);
            }
        });
    };

    module.exports = Queue;
}());
