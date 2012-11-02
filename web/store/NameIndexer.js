/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var NameIndexer = function () {
    };
    NameIndexer.prototype = new BaseStore();
    NameIndexer.prototype.keyPrefix = function () {
        return 'wb:name:index:';
    };
    /*
     * get user by user id
     * param [Number uid]
     * param callback(error, user)
     *
     */
    NameIndexer.prototype.getUid = function (name, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            client.get(store.key(name), function (error, uid) {
                client.end();
                callback(error, uid);
            });
        });
    };

    module.exports = NameIndexer;
}());
