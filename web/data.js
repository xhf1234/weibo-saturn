/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

    var User = function (uid, name) {
        this.uid = uid;
        this.name = name;
    };
    User.prototype.toString = function () {
        return 'uid:' + this.uid + ', name:' + this.name;
    };
    exports.User = User;

    var Edge = function (u, v) {
        u = parseInt(u, 10);
        v = parseInt(v, 10);
        if (u <= v) {
            this.u = u;
            this.v = v;
        } else {
            this.u = v;
            this.v = u;
        }
    };
    Edge.prototype.equals = function (edge) {
        return this.u === edge.u && this.v === edge.v;
    };
    Edge.prototype.toString = function () {
        return '[' + this.u + ', ' + this.v + ']';
    };
    exports.Edge = Edge;

    var Graph = function (v, e) {
        this.v = v || [];
        this.e = e || [];
    };
    Graph.prototype.containsVertex = function (v) {
        if (this.v.length === 0) {
            return false;
        }
        return this.v.some(function (u) {
            return u === v;
        });
    };
    Graph.prototype.containsEdge = function (edge) {
        if (this.e.length === 0) {
            return false;
        }
        return this.e.some(function (myEdge) {
            return myEdge.equals(edge);
        });
    };
    Graph.prototype.addEdge = function (u, v) {
        var edge = new Edge(u, v);
        if (!this.containsEdge(edge)) {
            this.e.push(edge);
        }
    };
    Graph.prototype.toString = function () {
        return '{\nv:' + this.v.join(',') + '\ne:' + this.e.join(',') + '\n}';
    };
    Graph.prototype.isClique = function () {
        return this.v.every(function (u) {
            return this.v.every(function (v) {
                var edge = null;
                if (u === v) {
                    return true;
                } else {
                    edge = new Edge(u, v);
                    return this.containsEdge(edge);
                }
            }, this);
        }, this);
    };
    Graph.prototype.removeVertex = function (v) {
        var index = this.v.indexOf(v);
        if (index !== -1) {
            this.v.splice(index, 1);
            this.e = this.e.filter(function (edge) {
                if (edge.u === v || edge.v === v) {
                    return false;
                }
                return true;
            }, this);
        }
    };
    Graph.prototype.clone = function () {
        var v = [];
        this.v.forEach(function (u) {
            v.push(u);
        });
        var G2 = new Graph(v);
        this.e.forEach(function (edge) {
            G2.addEdge(edge.u, edge.v);
        });
        return G2;
    };
    Graph.prototype.maxClique = function () {
        var size = this.v.length;
        var i = size;
        var c = null;
        var t = null;
        var j = null;
        var k = null;
        var GG = null;
        var flag = null;
        var toRemove = null;

        var removeVertex = function (v) {
            this.removeVertex(v);
        };
        while (i > 0) {
            c = size - i;
            t = [];
            for (j = 0; j < i; j = j + 1) {
                t.push(true);
            }
            for (j = 0; j < c; j = j + 1) {
                t.push(false);
            }
            while (true) {
                GG = this.clone();
                toRemove = [];
                for (j = 0; j < size; j = j + 1) {
                    if (!t[j]) {
                        toRemove.push(GG.v[j]);
                    }
                }
                toRemove.forEach(removeVertex, GG);
                if (GG.isClique()) {
                    return GG;
                }
                flag = true;
                for (j = c - 1; j >= 0; j = j - 1) {
                    if (t[j]) {
                        flag = false;
                    }
                }
                if (flag) {
                    break;
                } else {
                    j = size - 1;
                    while (t[j]) {
                        j = j - 1;
                    }
                    k = j - 1;
                    while (!t[k]) {
                        k = k - 1;
                    }
                    t[j] = true;
                    t[k] = false;
                }
            }
            i = i - 1;
        }
        return this;
    };
    exports.Graph = Graph;
    exports.makeGraph = function (friendIds, friendIdsList) {
        var G = new Graph(friendIds);
        var i, u, vs;
        var addEdge = function (v) {
            G.addEdge(this, v);
        };
        for (i = 0; i < friendIds.length; i = i + 1) {
            u = friendIds[i];
            vs = friendIdsList[i];
            vs = vs.filter(G.containsVertex, G);
            vs.forEach(addEdge, u);
        }
        return G;
    };
}());
