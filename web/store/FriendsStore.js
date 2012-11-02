/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var FriendsStore = function () {
    };
    FriendsStore.prototype = new BaseStore();

    FriendsStore.prototype.keyPrefix = function () {
        return 'wb:friendids:';
    };

    /*
     * get friendIds
     * param [Number, uid]
     * callback(error, friendIds)
     */
    FriendsStore.prototype.getFriendIds = function (uid, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            client.smembers(store.key(uid), function (error, friendIds) {
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

    /*
     * get friend ids array in a pipeline way
     * params [Array uids]
     * callback(error, [[friendIds], [friendIds], ...]
     */
    FriendsStore.prototype.getFriendIdsPipe = function (uids, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            var multi = client.multi();
            uids.forEach(function (uid) {
                multi.smembers(this.key(uid));
            }, store);
            multi.exec(function (error, friendIdsList) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var result = friendIdsList.map(function (friendIds) {
                        var b = friendIds instanceof Array;
                        if (!b) {
                            console.log('not array, friendIds = ' + friendIds);
                        }
                        if (friendIds && b) {
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
    
    module.exports = FriendsStore;
}());
