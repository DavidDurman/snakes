/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var PI = Math.PI;
var TWOPI = PI * 2;

if (!Function.prototype.bind)
    Function.prototype.bind = function(context /*, arg1, arg2... */) {
        "use strict";
        if (typeof this !== "function") throw new TypeError();
        var _arguments = Array.prototype.slice.call(arguments, 1),
            _this = this,
            _concat = Array.prototype.concat,
            _function = function() {
                return _this.apply(this instanceof _dummy ? this : context,
                                   _concat.apply(_arguments, arguments));
            },
            _dummy = function() {};
        _dummy.prototype = _this.prototype;
        _function.prototype = new _dummy();
        return _function;
    };

function d(str){
    document.getElementById("debug").innerHTML = str;
}

function mixin() {
        var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
        var extension = arguments[i];
        for (var key in extension) {
            if (!extension.hasOwnProperty(key)) continue;
            var getter = extension.__lookupGetter__(key);
            var setter = extension.__lookupSetter__(key);
            if (!getter && !setter) {
                var copy = extension[key];
                if (copy === target[key]) continue;
                if (typeof copy == "function" && typeof target[key] == "function" && !copy.base) copy.base = target[key];
                target[key] = copy;
                continue;
            }
            if (getter) target.__defineGetter__(key, getter);
            if (setter) target.__defineSetter__(key, setter);
        }
    }
    return target;
};


function skin(path){
    var s = document.getElementById("skin");
    if (!s) {
        s = document.createElement("link");
        s.setAttribute("id", "skin");
        s.setAttribute("type", "text/css");
        s.setAttribute("rel", "stylesheet");
        document.getElementsByTagName("head")[0].appendChild(s);
    }
    s.setAttribute("href", path);
}

function scriptAppend(path){
        var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.id = path.replace("/", "-");
    script.src = path;
    document.body.appendChild(script);
}

function rle_encode(arr){
    var res = [], i = 1, l = arr.length,
        last, lastCount, curr;
    last = arr[0];
    lastCount = 1;
    for (; i < l; i++){
        curr = arr[i];
        if (last === curr){
            if (i === l - 1){  // last item
                res.push([lastCount + 1, last]);
            }
            lastCount++;
        } else {
            res.push([lastCount, last]);
            if (i === l - 1){  // last item
                res.push([1, curr]);
            }
            last = curr;
            lastCount = 1;
        }
    }
    return res;
}

function rle_decode(arr){
    var res = [], i = 0, l = arr.length, j, pair, count, item;
    for (; i < l; i++){
        pair = arr[i];
        count = pair[0];
        item = pair[1];
        for (j = 0; j < count; j++){
            res.push(item);
        }
    }
    return res;
}


function keys(obj){
    var ret = [];
    for (var k in obj){
        if (obj.hasOwnProperty(k))
            ret.push(k);
    }
    return ret;
}

Array.prototype.count = function(element) {
    var count = 0;
    var len = this.length;
    for (var i = 0; i < len; i++)
        if (this[i] == element)
            count++;

    return count;
};

Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
    return max;
};
