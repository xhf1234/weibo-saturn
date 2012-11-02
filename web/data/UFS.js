/*jslint node: true, indent: 4, nomen:true, vars: true */
/*global require */

(function () {
    "use strict";

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
    module.exports = UFS;
    
}());
