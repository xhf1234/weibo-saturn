/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    require('./Bootstrap').ready(function () {
        var requestListener = function (req, resp) {
            require('./Dispatcher').dispatch(req, resp);
        };

        var server = require('http').createServer(requestListener);
        server.listen(8008, '127.0.0.1');

        require('./ctrl/MustacheController');
        require('./ctrl/WeiboController');
    });

}());
