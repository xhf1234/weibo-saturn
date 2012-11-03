/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var redisHost = require('../Const').redisHost;

    var BaseStore = function () {
    };

    /*
     * create and return the redis client
     */
    BaseStore.prototype.getClient = function () {
        var redis = require('redis');
        var client = redis.createClient(6379, redisHost);
        client.on('error', function (error) {
            console.error(error);
        });
        return client;
    };
    BaseStore.prototype.keyPrefix = function () {
        // abstract method
    };
    BaseStore.prototype.key = function (id) {
        return this.keyPrefix() + id;
    };
    BaseStore.prototype.keys = function (callback) {
        return this.getClient().keys(this.keyPrefix() + '*', callback);
    };
    module.exports = BaseStore;
}());
