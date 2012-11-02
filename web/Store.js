/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var UserStore = require('./store/UserStore');
    var userStore = new UserStore();
    var NameIndexer = require('./store/NameIndexer');
    var nameIndexer = new NameIndexer();
    var FriendsStore = require('./store/FriendsStore');
    var friendsStore = new FriendsStore();
    var Queue = require('./store/Queue');
    var queue = new Queue();
    var NameQueue = require('./store/NameQueue');
    var nameQueue = new NameQueue();

    /* 
     * get user id by name
     * param [String name]
     * param callback(error, uid)
     *
     */
    exports.getUid = nameIndexer.getUid.bind(nameIndexer);

    /*
     * get user by user id
     * param [Number uid]
     * param callback(error, user)
     *
     */
    exports.getUser = userStore.getUser.bind(userStore);

    /*
     * get users in a pipeline way.
     * param [Array uids]
     * param callback(error, users)
     */
    exports.getUserPipe = userStore.getUserPipe.bind(userStore);

    /*
     * get all users
     *
     */
    exports.getAllUsers = userStore.getAllUsers.bind(userStore);
    
    /*
     * get friendIds
     * param [Number, uid]
     * callback(error, friendIds)
     */
    exports.getFriendIds = friendsStore.getFriendIds.bind(friendsStore);

    /*
     * get friend ids array in a pipeline way
     * params [Array uids]
     * callback(error, [[friendIds], [friendIds], ...]
     */
    exports.getFriendIdsPipe = friendsStore.getFriendIdsPipe.bind(friendsStore);

    /*
     * get friends
     * param [Number uid]
     * callback(error, users)
     */
    exports.getFriends = function (uid, callback) {
        friendsStore.getFriendIds(uid, function (error, friendIds) {
            if (error) {
                callback(error, null);
            } else {
                userStore.getUserPipe(friendIds, function (error, users) {
                    callback(error, users);
                });
            }
        });
    };

    /*
     * put the uid in front of the queue
     * param [Number uids]
     * param callback(error)
     */
    exports.putQueueFront = queue.putQueueFront.bind(queue);

    /*
     * put the uids in front of the queue
     * param [Array uids]
     * param callback(error)
     */
    exports.putQueueFrontPipe = queue.putQueueFrontPipe.bind(queue);

    /*
     * enqueue the name
     * param [String name]
     * param callback(error)
     */
    exports.enqueueName = nameQueue.enqueueName.bind(nameQueue);
}());
