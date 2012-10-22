/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    require('./Bootstrap').ready(function () {
        require('./Store');
    });
}());
