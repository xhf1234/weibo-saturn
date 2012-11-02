/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var Queue = function () {
        this.list = [];
    };
    Queue.prototype.enqueue = function (v) {
        this.list.push(v);
    };
    Queue.prototype.dequeue = function () {
        return this.list.shift();
    };
    Queue.prototype.toString = function () {
        return this.list.toString();
    };
    var innerBFS = function (context, adj, callback) {
        var v = context.queue.dequeue();
        if (v) {
            if (context.tmp[v.toString()]) {
                innerBFS(context, adj, callback);
                return;
            }
            adj(v, function (error, friendIds) {
                if (error) {
                    callback(error, null);
                } else {
                    context.tmp[v.toString()] = true;
                    var found = friendIds.some(function (u) {
                        if (!context.tmp[u.toString()]) {
                            if (u === context.dst) {
                                var path = [u];
                                u = v;
                                while (u !== null) {
                                    path.unshift(u);
                                    u = context.pi[u.toString()];
                                }
                                callback(null, path);
                                return true;
                            } else if (context.d[v] < 5) {
                                context.d[u.toString()] = context.d[v.toString()] + 1;
                                context.pi[u.toString()] = v;
                                context.queue.enqueue(u);
                            }
                        }
                        return false;
                    });
                    if (!found) {
                        innerBFS(context, adj, callback);
                    }
                }
            });
        } else {
            callback(null, null);
        }
    };
    var BFS = function (src, dst, adj, callback) {
        src = parseInt(src, 10);
        dst = parseInt(dst, 10);
        var path = [];
        if (src === dst) {
            path.push(src);
            callback(null, path);
        } else {
            var queue = new Queue();
            queue.enqueue(src);
            var pi = {};
            pi[src.toString()] = null;
            var d = {};
            d[src.toString()] = 0;
            var tmp = {};
            var context = {
                queue: queue,
                src: src,
                dst: dst,
                pi: pi,
                d: d,
                tmp: tmp
            };
            innerBFS(context, adj, callback);
        }
    };
    module.exports = BFS;
}());
