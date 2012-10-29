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
    exports.getUid = function (name, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.get('wb:name:index:' + name, function (error, uid) {
                client.end();
                callback(error, uid);
            });
        });
    };
    exports.getUserPipe = function (uids, callback) {
        var client = getClient();
        client.on("connect", function () {
            var multi = client.multi();
            uids.forEach(function (uid) {
                multi.hget('wb:user:' + uid, 'name');
            });
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

    exports.getUser = function (uid, callback) {
        if (!uid) {
            console.error('uid === null');
            return null;
        }
        var client = getClient();
        client.on("connect", function () {
            client.hget('wb:user:' + uid, 'name', function (error, result) {
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
    exports.getUsers = function (callback) {
        var client = getClient();
        client.on("connect", function () {
            client.keys('wb:user:*', function (error, keys) {
                client.end();
                client = getClient();
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
    exports.getFriendIds = function (uid, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.smembers('wb:friendids:' + uid, function (error, friendIds) {
                client.end();
                friendIds = friendIds.filter(function (friendId) {
                    return friendId !== null;
                });
                friendIds = friendIds.map(function (friendId) {
                    return parseInt(friendId, 10);
                });
                callback(error, friendIds);
            });
        });
    };
    exports.getFriendIdsPipe = function (uids, callback) {
        var client = getClient();
        client.on("connect", function () {
            var multi = client.multi();
            uids.forEach(function (uid) {
                multi.smembers('wb:friendids:' + uid);
            });
            multi.exec(function (error, friendIdsList) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var result = friendIdsList.map(function (friendIds) {
                        console.log('friendIds = ' + friendIds);
                        if (friendIds) {
                            return friendIds.map(function (friendId) {
                                return parseInt(friendId, 10);
                            });
                        } else {
                            return [];
                        }
                    });
                    callback(null, result);
                }
            });
        });
    };
    exports.getFriends = function (uid, callback) {
        var client = getClient();
        client.on("connect", function () {
            client.smembers('wb:friendids:' + uid, function (error, result) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var friendIds = result;
                    client = getClient();
                    var multi = client.multi();
                    friendIds.forEach(function (friendId) {
                        multi.hget('wb:user:' + friendId, 'name');
                    });
                    multi.exec(function (error, names) {
                        client.end();
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
    exports.putQueueFront = function (uid, callback) {
        var client = getClient();
        client.zincrby('wb:queue', 10000, uid, function (error, result) {
            client.end();
            if (callback) {
                callback(error, result);
            }
        });
    };
    exports.enqueueName = function (name) {
        var client = getClient();
        client.rpush('wb:name:queue', name, function (error, result) {
            client.end();
        });
    };


}());
