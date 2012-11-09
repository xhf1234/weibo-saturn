/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var BaseStore = require('./BaseStore');
    var Host = require('../data/Host');
    var HostStore = function () {
    };
    HostStore.prototype = new BaseStore();

    HostStore.prototype.keyPrefix = function () {
        return 'wb:teacher:';
    };

    /*
     * get hosts in a pipeline way.
     * param [Array uids]
     * param callback(error, hosts)
     */
    HostStore.prototype.getHostPipe = function (uids, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            var multi = client.multi();
            uids.forEach(function (uid) {
                multi.hget(this.key(uid), 'name');
                multi.hget(this.key(uid), 'fansCount');
                multi.hget(this.key(uid), 'verify');
                multi.hget(this.key(uid), 'avatar');
                multi.hget(this.key(uid), 'url');
            }, store);
            multi.exec(function (error, results) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    var hosts = [];
                    var i = 0;
                    var name, fansCount, verify, avatar, url;
                    while (i < uids.length) {
                        name = results[i * 5];
                        fansCount = parseInt(results[i * 5 + 1], 10);
                        verify = results[i * 5 + 2];
                        avatar = results[i * 5 + 3];
                        url = results[i * 5 + 4];
                        hosts.push(new Host(uids[i], name, fansCount, verify, avatar, url));
                        i = i + 1;
                    }
                    callback(null, hosts);
                }
            });
        });
    };

    HostStore.prototype.range = function (offset, limit, callback) {
        var client = this.getClient();
        var store = this;
        client.on("connect", function () {
            client.zrange('wb:teacher-sort', offset, offset + limit - 1, function (error, uids) {
                client.end();
                if (error) {
                    callback(error, null);
                } else {
                    uids = uids.map(function (uid) {
                        return parseInt(uid, 10);
                    });
                    callback(null, uids);
                }
            });
        });
    };

    module.exports = HostStore;

}());
