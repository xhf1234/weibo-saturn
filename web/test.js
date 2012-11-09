/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    require('./Bootstrap').ready(function () {
        var Store = require('./Store');
        var Host = require('./data/Host');
        Store.rangeHostUids(0, 10, function (error, uids) {
            console.log('uids = ' + uids);
            Store.getHosts(uids, function (error, hosts) {
                console.log('hosts = ' + hosts);
            });
        });
    });
}());
