'use strict';

let {
    getPredicatePath, getPredicateMetaInfo
} = require('../model');

let {
    map, mergeMap
} = require('bolzano');

let getArgs = ({
    value,
    predicatesMetaInfo
}) => {
    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath) || {};
    return args || [];
};

const id = v => v;

let getPrefixParamser = (data, {
    itemRender
}) => (infix = 0) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    let params = value.params.slice(0, infix);

    return map(args.slice(0, infix), (opts, index) => {
        opts = opts || {};

        return itemRender(mergeMap(opts, {
            title: opts.name,

            value: mergeMap(params[index] || {}, opts.value || {}),

            onchange: (itemValue) => {
                params[index] = itemValue;
                value.params = params.concat(value.params.slice(infix));
                onchange(value);
            }
        }));
    });
};

let getSuffixParamser = (data, {
    itemRender
}) => (infix = 0) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    let params = value.params.slice(infix);

    return map(args.slice(infix), (opts, index) => {
        opts = opts || {};

        return itemRender(mergeMap(opts, {
            title: opts.name,

            value: mergeMap(params[index] || {}, opts.value || {}),

            onchange: (itemValue) => {
                params[index] = itemValue;
                value.params = value.params.slice(0, infix).concat(params);
                onchange(value);
            }
        }));
    });
};

module.exports = {
    getPrefixParamser,
    getSuffixParamser
};
