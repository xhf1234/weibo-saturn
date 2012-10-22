/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var path = require('path');
    var fs = require('fs');
    var Properties = require('properties');
    var async = require('async');

    // get the config file's absolute path
    var getConfig = function (file) {
        return path.normalize(__dirname + '/../' + file);
    };

    // load config done
    var done = false;
    // call this when load config done
    var callbackOnDone = null;
    // load default.config
    var loadDefault = function (callback) {
        new Properties().load(getConfig('default.config'), function (error) {
            if (error) {
                callback(error, null);
            } else {
                var redisHost = this.get('redis.host');
                var initUid = this.get('init.uid');
                var result = {};
                result.redisHost = redisHost;
                result.initUid = initUid;
                callback(null, result);
            }
        });
    };
    // load local.config
    var loadLocal = function (callback) {
        var result = {};
        if (fs.existsSync(getConfig('local.config'))) {
            new Properties().load(getConfig('local.config'), function (error) {
                if (error) {
                    callback(error, null);
                } else {
                    var redisHost = this.get('redis.host');
                    var initUid = this.get('init.uid');
                    result.redisHost = redisHost;
                    result.initUid = initUid;
                    callback(null, result);
                }
            });
        } else {
            callback(null, result);
        }
    };
    // call this when load config done
    var onDone = function (error, results) {
        if (error) {
            console.error(error);
        } else {
            if (results[1].redisHost) {// redisHost exists in local.config
                exports.redisHost = results[1].redisHost;
            } else {
                exports.redisHost = results[0].redisHost;
            }
            if (results[1].initUid) {
                exports.initUid = results[1].initUid;
            } else {
                exports.initUid = results[0].initUid;
            }
        }
        done = true;
        if (callbackOnDone) {
            callbackOnDone();
            callbackOnDone = null;
        }
    };
    async.series([loadDefault, loadLocal], onDone);

    exports.load = function (callback) {
        if (done) {//already loaded
            callback();
        } else {//waiting the config loading to finish
            callbackOnDone = callback;
        }
    };
}());
