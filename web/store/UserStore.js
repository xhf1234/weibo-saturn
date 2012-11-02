/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var User = require('../data/User');
    var UserStore = function () {
    };
    UserStore.prototype = new BaseStore();

    UserStore.prototype.keyPrefix = function () {
        return 'wb:user:';
    };

    /*
     * get user by user id
     * param [Number uid]
     * param callback(error, user)
     *
     */
    UserStore.prototype.getUser = function (uid, callback) {
        if (!uid) {
            console.error('uid === null');
            return null;
        }
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            client.hget(store.key(uid), 'name', function (error, result) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var user = new User(uid, result);
                    callback(null, user);
                }
            });
        });
    };

    /*
     * get users in a pipeline way.
     * param [Array uids]
     * param callback(error, users)
     */
    UserStore.prototype.getUserPipe = function (uids, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            var multi = client.multi();
            uids.forEach(function (uid) {
                multi.hget(this.key(uid), 'name');
            }, store);
            multi.exec(function (error, names) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var users = [];
                    var i = 0;
                    while (i < uids.length) {
                        if (names[i]) {
                            users.push(new User(uids[i], names[i]));
                        }
                        i = i + 1;
                    }
                    callback(null, users);
                }
            });
        });
    };

    /*
     * get all users
     *
     */
    UserStore.prototype.getAllUsers = function (callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            store.keys(function (error, keys) {
                client.end();
                client = this.getClient();
                var multi = client.multi();
                keys = keys.filter(function (key) {
                    return key;
                });
                keys.forEach(function (key) {
                    multi.hget(key, 'name');
                });
                multi.exec(function (error, names) {
                    client.end();
                    var users = [];
                    var i, uid, name, user, key;
                    for (i = 0; i < keys.length; i = i + 1) {
                        key = keys[i];
                        uid = parseInt(key.substr(8), 10);
                        name = names[i];
                        if (!name) {
                            name = uid.toString();
                        }
                        user = new User(uid, name);
                        users.push(user);
                    }
                    callback(null, users);
                });
            });
        });
    };
    module.exports = UserStore;

}());
