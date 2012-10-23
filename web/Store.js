/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var redisHost = require('./Const').redisHost;
    var getClient = function () {
        var redis = require('redis');
        var client = redis.createClient(6379, redisHost);
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
                    var User = require('./data').User;
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
                    var async = require('async');
                    var callbackFilter = function (error, friends) {
                        friends = friends.filter(function (user) {
                            return user;
                        });
                        callback(null, friends);
                    };
                    async.map(friendIds, exports.getUser, callbackFilter);
                }
            });
        });
    };
}());
