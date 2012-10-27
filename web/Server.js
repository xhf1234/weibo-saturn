/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    require('./Bootstrap').ready(function () {
        var port = require('./Const').webPort;
        console.log('port = ' + port);
        var requestListener = function (req, resp) {
            require('./Dispatcher').dispatch(req, resp);
        };

        var server = require('http').createServer(requestListener);
        server.on('error', function (error) {
            console.error(error);
        });
        server.listen(port);

        require('./ctrl/MustacheController');
        require('./ctrl/WeiboController');
    });

}());
