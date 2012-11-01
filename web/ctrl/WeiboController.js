/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";
    
    var WeiboController = require('../Controller').extend('weibo');

    var Handler = require('./Handler');

    var onError = function (req, resp, error) {
        resp.writeHead(500);
        resp.end(error, 'utf-8');
    };

    /* weibo/user/uid={uid} */
    var GetUserHandler = Handler.extend('user', 'GET');
    GetUserHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var uid = params.uid;
        var Store = require('../Store');
        Store.getUser(uid, function (error, user) {
            if (error) {
                onError(req, resp, error);
            } else {
                resp.writeHead(200, { 'Content-Type': 'application/json'});
                resp.end(JSON.stringify(user), 'utf-8');
            }
        });
    };

    /* weibo/clique?name=$name */
    var CliqueHandler = Handler.extend('clique', 'GET');
    CliqueHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var name = params.name;
        var flag = params.flag;
        var Store = require('../Store');
        Store.getUid(name, function (error, uid) {
            if (error) {
                onError(req, resp, error);
            } else {
                if (uid) {
                    Store.getUser(uid, function (error, user) {
                        if (error) {
                            onError(req, resp, error);
                        } else {
                            var view = require('liteview');
                            var path = require('path');
                            var tpl_base = path.normalize(__dirname + '/../front/html/weibo');
                            view.init(tpl_base);
                            view.debug(true);
                            Store.getFriendIds(uid, function (error, friendIds) {
                                if (error) {
                                    onError(req, resp, error);
                                } else {
                                    Store.getFriendIdsPipe(friendIds, function (error, friendIdsList) {
                                        var Data = require('../data');
                                        var G = null;
                                        if (error) {
                                            onError(req, resp, error);
                                        } else {
                                            G = Data.makeGraph(friendIds, friendIdsList);
                                            if (flag) {
                                                G = G.maxClique2();
                                            } else {
                                                G = G.maxClique();
                                            }
                                            Store.getUserPipe(G.v, function (error, friends) {
                                                if (error) {
                                                    onError(req, resp, error);
                                                } else {
                                                    var data = {};
                                                    data.user = JSON.stringify(user);
                                                    data.friends = JSON.stringify(friends);
                                                    var html = view.render('clique.html', data);
                                                    resp.writeHead(200, { 'Content-Type': 'text/html'});
                                                    resp.end(html, 'utf-8');
                                                    Store.putQueueFrontPipe(friendIds);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    Store.putQueueFront(uid);
                } else {
                    Store.enqueueName(name);
                    resp.writeHead(200);
                    resp.end("User not found!", 'utf-8');
                }
            }
        });
    };

    /* weibo/relation?name=$name */
    var RelationHandler = Handler.extend('relation', 'GET');
    RelationHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var name = params.name;
        var Store = require('../Store');
        Store.getUid(name, function (error, uid) {
            if (error) {
                onError(req, resp, error);
            } else {
                if (uid) {
                    Store.getUser(uid, function (error, user) {
                        if (error) {
                            onError(req, resp, error);
                        } else {
                            var view = require('liteview');
                            var path = require('path');
                            var tpl_base = path.normalize(__dirname + '/../front/html/weibo');
                            view.init(tpl_base);
                            view.debug(true);
                            Store.getFriends(uid, function (error, friends) {
                                if (error) {
                                    onError(req, resp, error);
                                } else {
                                    var data = {};
                                    data.user = JSON.stringify(user);
                                    data.friends = JSON.stringify(friends);
                                    var html = view.render('relation.html', data);
                                    resp.writeHead(200, { 'Content-Type': 'text/html'});
                                    resp.end(html, 'utf-8');
                                }
                            });
                        }
                    });
                    Store.putQueueFront(uid);
                } else {
                    Store.enqueueName(name);
                    resp.writeHead(200);
                    resp.end("User not found!", 'utf-8');
                }
            }
        });
    };
    
    var ExpandHandler = Handler.extend('expand', 'GET');
    ExpandHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var uid = params.uid;
        var Store = require('../Store');
        Store.getFriends(uid, function (error, friends) {
            if (error) {
                onError(req, resp, error);
            } else {
                resp.writeHead(200, { 'Content-Type': 'application/json'});
                resp.end(JSON.stringify(friends), 'utf-8');
            }
        });
        Store.putQueueFront(uid);
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new GetUserHandler());
    ctrl.addHandler(new RelationHandler());
    ctrl.addHandler(new CliqueHandler());
    ctrl.addHandler(new ExpandHandler());
    ctrl.init();
}());
