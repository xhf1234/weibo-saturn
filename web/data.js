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

    var UFS = function (values) {
        this.items = {};
        values.forEach(function (v) {
            this.items[v] = this.makeSet(v);
        }, this);
    };
    UFS.prototype.makeSet = function (v) {
        return {
            value: v,
            rank: 0,
            parent: null
        };
    };
    UFS.prototype.find = function (v) {
        var item = this.items[v];
        var root;
        if (item.parent === null) {
            return item.value;
        } else {
            root = this.items[this.find(item.parent.value)];
            item.parent = root;
            return root.value;
        }
    };
    UFS.prototype.union = function (u, v) {
        var item1 = this.items[this.find(u)];
        var item2 = this.items[this.find(v)];
        if (item1.value === item2.value) {
            return;
        }
        if (item1.rank < item2.rank) {
            item1.parent = item2;
            return item2.value;
        } else {
            item2.parent = item1;
            if (item1.rank === item2.rank) {
                item1.rank = item1.rank + 1;
            }
            return item1.value;
        }
    };
    UFS.prototype.toString = function () {
        return this.items;
    };
    exports.UFS = UFS;

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
    Edge.prototype.contains = function (v) {
        return this.u === v || this.v === v;
    };
    Edge.prototype.toString = function () {
        return '[' + this.u + ', ' + this.v + ']';
    };
    exports.Edge = Edge;

    var Graph = function (v, edges) {
        this.v = v || [];
        this.e = [];
        var i, j, t;
        for (i = 0; i < v.length; i = i + 1) {
            t = [];
            for (j = 0; j < v.length; j = j + 1) {
                t.push(false);
            }
            this.e.push(t);
        }
        if (edges) {
            edges.forEach(function (edge) {
                this.addEdge(edge.u, edge.v);
            });
        }
    };
    Graph.prototype.containsVertex = function (v) {
        var i = this.v.indexOf(v);
        return i !== -1;
    };
    Graph.prototype.containsEdge = function (edge) {
        var i = this.v.indexOf(edge.u);
        var j = this.v.indexOf(edge.v);
        if (i === -1 || j === -1) {
            return false;
        }
        return this.e[i][j];
    };
    Graph.prototype.addEdge = function (u, v) {
        u = parseInt(u, 10);
        v = parseInt(v, 10);
        var i = this.v.indexOf(u);
        var j = this.v.indexOf(v);
        if (i === -1 || j === -1) {
            return;
        }
        this.e[i][j] = this.e[j][i] = true;
    };
    Graph.prototype.getEdges = function () {
        var edges = [];
        var i, j;
        for (i = 0; i < this.v.length - 1; i = i + 1) {
            for (j = i + 1; j < this.v.length; j = j + 1) {
                if (this.e[i][j]) {
                    edges.push(new Edge(this.v[i], this.v[j]));
                }
            }
        }
        return edges;
    };
    Graph.prototype.toString = function () {
        return '{\nv:' + this.v.join(',') + '\ne:' + this.getEdges().join(',') + '\n}';
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
            this.e.splice(index, 1);
            this.e.forEach(function (es) {
                es.splice(index, 1);
            });
        }
    };
    Graph.prototype.clone = function () {
        var v = [];
        this.v.forEach(function (u) {
            v.push(u);
        });
        var G2 = new Graph(v);
        this.getEdges().forEach(function (edge) {
            G2.addEdge(edge.u, edge.v);
        });
        return G2;
    };
    Graph.prototype.adjEdges = function (v) {
        var i = this.v.indexOf(v);
        var j;
        if (i === -1) {
            return [];
        }
        var edges = [];
        for (j = 0; j < this.v.length; j = j + 1) {
            if (this.e[i][j]) {
                edges.push(new Edge(this.v[i], this.v[j]));
            }
        }
        return edges;
    };
    Graph.prototype.adjVertexs = function (v) {
        var i = this.v.indexOf(v);
        if (i === -1) {
            return [];
        }
        var vertexs = [];
        var j;
        for (j = 0; j < this.v.length; j = j + 1) {
            if (this.e[i][j]) {
                vertexs.push(this.v[j]);
            }
        }
        return vertexs;
    };
    Graph.prototype.reduceGraph = function (v) {
        var vertexs = this.adjVertexs(v);
        var G = new Graph(vertexs);
        this.getEdges().forEach(function (edge) {
            G.addEdge(edge.u, edge.v);
        });
        return G;
    };
    var isAllUnioned = function (G, ufs) {
        if (G.v.length < 2) {
            return true;
        }
        var set = ufs.find(G.v[0]);
        var i;
        for (i = 1; i < G.v.length; i = i + 1) {
            if (ufs.find(G.v[i]) !== set) {
                return false;
            }
        }
        return true;
    };
    var setCount = function (G, ufs, x) {
        var count = 0;
        x = ufs.find(x);
        G.v.forEach(function (v) {
            if (ufs.find(v) === x) {
                count = count + 1;
            }
        });
        return count;
    };
    var findNotIn = function (G, ufs, x) {
        var r;
        x = ufs.find(x);
        G.v.some(function (v) {
            if (ufs.find(v) !== x) {
                r = v;
                return true;
            }
            return false;
        });
        return r;
    };
    Graph.prototype.maxClique = function () {
        if (this.v.length <= 1) {
            return this;
        }
        var ufs = new UFS(this.v);
        var set = null;
        var maxList = [];
        var v, u, GG, t;
        var union = function (v) {
            return ufs.union(parseInt(this, 10), v);
        };
        while (set === null || setCount(this, ufs, set) !== this.v.length) {
            if (set === null) {
                v = this.v[0];
                set = ufs.find(v);
            } else {
                v = findNotIn(this, ufs, set);
            }
            GG = this.reduceGraph(v);
            GG = GG.maxClique();
            t = GG.v.slice(0, GG.v.length);
            t.push(v);
            t.forEach(union, set);
            set = ufs.find(set);
            maxList.push(t);
        }
        var max = [];
        maxList.forEach(function (list) {
            if (list.length > max.length) {
                max = list;
            }
        });
        GG = new Graph(max);
        this.getEdges().forEach(function (edge) {
            GG.addEdge(edge.u, edge.v);
        });
        return GG;
    };
    Graph.prototype.maxClique2 = function () {
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
                flag = false;
                for (j = 1; j < size; j += 1) {
                    if (!t[j] && t[j - 1]) {
                        flag = true;
                        t[j] = true;
                        t[j - 1] = false;
                        j = j - 2;
                        k = 0;
                        while (j > k) {
                            while (j > k && !t[j]) {
                                j -= 1;
                            }
                            while (j > k && t[k]) {
                                k += 1;
                            }
                            if (j > k) {
                                t[j] = false;
                                t[k] = true;
                                j -= 1;
                                k += 1;
                            }
                        }
                        break;
                    }
                }
                if (!flag) {
                    break;
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
