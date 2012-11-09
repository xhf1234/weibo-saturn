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
                            Store.getFriendIds(uid, function (error, friendIds) {
                                if (error) {
                                    onError(req, resp, error);
                                } else {
                                    Store.getFriendIdsPipe(friendIds, function (error, friendIdsList) {
                                        var Graph = require('../data/Graph');
                                        var G = null;
                                        if (error) {
                                            onError(req, resp, error);
                                        } else {
                                            G = Graph.makeGraph(friendIds, friendIdsList);
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
                                                    var handlebars = require('../lib/handlebars');
                                                    var html = handlebars.renderFile('weibo/clique.handlebars', data);
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
                            Store.getFriends(uid, function (error, friends) {
                                if (error) {
                                    onError(req, resp, error);
                                } else {
                                    var data = {};
                                    data.user = JSON.stringify(user);
                                    data.friends = JSON.stringify(friends);
                                    var handlebars = require('../lib/handlebars');
                                    var html = handlebars.renderFile('weibo/relation.handlebars', data);
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

    var PathHandler = Handler.extend('path', 'GET');
    PathHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var srcName = params.src;
        var dstName = params.dst;
        var Store = require('../Store');
        Store.getUid(srcName, function (error, srcUid) {
            if (error) {
                onError(req, resp, error);
            } else {
                if (srcUid) {
                    Store.getUid(dstName, function (error, dstUid) {
                        if (error) {
                            onError(req, resp, error);
                        } else {
                            if (dstUid) {
                                console.log('srcUid = ' + srcUid);
                                console.log('dstUid = ' + dstUid);
                                var BFS = require('../algorithm/BFS');
                                BFS.BFS(srcUid, dstUid, Store.getFriendIds, function (error, path) {
                                    if (error) {
                                        onError(req, resp, error);
                                    } else {
                                        if (path) {
                                            Store.getUserPipe(path, function (error, users) {
                                                if (error) {
                                                    onError(req, resp, error);
                                                } else {
                                                    var data = {};
                                                    data.users = JSON.stringify(users);
                                                    console.log('data.users = ' + data.users);
                                                    var handlebars = require('../lib/handlebars');
                                                    var html = handlebars.renderFile('weibo/path.handlebars', data);
                                                    resp.writeHead(200, { 'Content-Type': 'text/html'});
                                                    resp.end(html, 'utf-8');
                                                }
                                            });
                                        } else {
                                            resp.writeHead(200);
                                            resp.end("path not exists!", 'utf-8');
                                        }
                                    }
                                });
                                Store.putQueueFront(dstUid);
                            } else {
                                Store.enqueueName(dstName);
                                resp.writeHead(200);
                                resp.end("User not found! " + dstName, 'utf-8');
                            }
                        }
                    });
                    Store.putQueueFront(srcUid);
                } else {
                    Store.enqueueName(srcName);
                    resp.writeHead(200);
                    resp.end("User not found! " + srcName, 'utf-8');
                }
            }
        });
    };
    var HostHandler = Handler.extend('hosts', 'GET');
    HostHandler.prototype.handle = function (req, resp) {
        var params = require('../HttpUtils').getParams(req);
        var page = params.page;
        var Store = require('../Store');
        Store.rangeHostUids(page * 30, 30, function (error, uids) {
            if (error) {
                onError(req, resp, error);
            } else {
                Store.getHosts(uids, function (error, hosts) {
                    if (error) {
                        onError(req, resp, error);
                    } else {
                        resp.writeHead(200, { 'Content-Type': 'application/json'});
                        resp.end(JSON.stringify(hosts), 'utf-8');
                    }
                });
            }
        });
    };

    var ctrl = new WeiboController();
    ctrl.addHandler(new GetUserHandler());
    ctrl.addHandler(new RelationHandler());
    ctrl.addHandler(new CliqueHandler());
    ctrl.addHandler(new ExpandHandler());
    ctrl.addHandler(new PathHandler());
    ctrl.addHandler(new HostHandler());
    ctrl.init();
}());
