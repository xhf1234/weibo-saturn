/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var User = require('./data').User;
    var redisHost = require('./Const').redisHost;
    var getClient = function () {
        var redis = require('redis');
        var client = redis.createClient(6379, redisHost);
        client.on('error', function (error) {
            console.error(error);
        });
        return client;
    };
    exports.getUser = function (uid, callback) {
        if (!uid) {
            console.error('uid === null');
            return null;
        }
        var client = getClient();
        client.on("connect", function () {
            client.hget('wb:user:' + uid, 'name', function (error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    var user = new User(uid, result);
                    callback(null, user);
                }
            });
        });
    };
    exports.getFriends = function (uid, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.smembers('wb:friendids:' + uid, function (error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    var friendIds = result;
                    var multi = client.multi();
                    friendIds.forEach(function (friendId) {
                        multi.hget('wb:user:' + friendId, 'name');
                    });
                    multi.exec(function (error, names) {
                        var results = [];
                        var i = 0;
                        while (i < friendIds.length) {
                            if (names[i]) {
                                results.push(new User(friendIds[i], names[i]));
                            }
                            i = i + 1;
                        }
                        callback(null, results);
                    });
                }
            });
        });
    };
}());
