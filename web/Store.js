/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var getClient = function () {
        var redis = require('redis');
        var client = redis.createClient(6379, '166.111.137.218');
        return client;
    };
    exports.getUser = function (uid, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.hget('wb:user:' + uid, 'name', function (error, result) {
                if (error) {
                    console.error(error);
                } else {
                    var User = require('./data').User;
                    var user = new User(uid, result);
                    callback(user);
                }
            });
        });
    };
    exports.getFriends = function (uid, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.smembers('wb:friendids:' + uid, function (error, result) {
                if (error) {
                    console.error(error);
                } else {
                    var friendIds = result;
                    callback(friendIds);
                }
            });
        });
    };
}());
