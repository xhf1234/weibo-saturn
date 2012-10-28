/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    require('./Bootstrap').ready(function () {
        var store = require('./Store');
        store.getUsers(function (error, users) {
            users.forEach(function (user) {
                if (!user.name) {
                    console.log('user = ' + user);
                } else if (user.name.length < 2) {
                    console.log('user = ' + user);
                }
            });
        });
    });
}());
