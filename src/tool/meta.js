'use strict';

let {
    isFunction, funType, isObject
} = require('basetype');

/**
 * define meta info at a function
 *
 * info = {
 *    viewer,
 *    args: [{}, {}, ..., {}]
 * }
 */

module.exports = funType((fun, meta) => {
    fun.meta = meta;
    return fun;
}, [isFunction, isObject]);
