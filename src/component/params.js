'use strict';

let ParamsFieldView = require('../view/paramsFieldView');

let {
    getPredicatePath, getPredicateMetaInfo
} = require('../model');

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

let getPrefixParams = (data, {
    itemRender
}) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    return ParamsFieldView({
        itemRender,

        onchange: (params) => {
            value.params = params.concat(value.params.slice(value.infix));
            onchange(value);
        },

        args: args.slice(0, value.infix),

        params: value.params.slice(0, value.infix)
    });
};

let getSuffixParams = (data, {
    itemRender
}) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    return ParamsFieldView({
        itemRender,

        onchange: (params) => {
            value.params = value.params.slice(0, value.infix).concat(params);
            onchange(value);
        },

        args: args.slice(value.infix),

        params: value.params.slice(value.infix)
    });
};

module.exports = {
    getPrefixParams,
    getSuffixParams
};
