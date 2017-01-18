'use strict';

let ParamsFieldView = require('./component/paramsFieldView');

let {
    getPredicatePath, getPredicateMetaInfo, getContext
} = require('./model');

let {
    mergeMap
} = require('bolzano');

let getArgs = ({
    value,
    predicatesMetaInfo
}) => {
    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath);
    return args;
};

const id = v => v;

module.exports = (data, {
    expressionView, onexpandchange
}) => {
    let getPrefixParams = () => {
        let {
            value,
            onchange = id
        } = data;

        let args = getArgs(data);

        return ParamsFieldView({
            itemRender: ({
                title,
                content,
                onchange
            }) => expressionView(mergeMap(getContext(data), {
                title,
                onchange,
                onexpandchange,
                value: content,
            })),

            onchange: (params) => {
                value.params = params.concat(value.params.slice(value.infix));
                onchange(value);
            },

            args: args.slice(0, value.infix),

            params: value.params.slice(0, value.infix)
        });
    };

    let getSuffixParams = () => {
        let {
            value,
            onchange = id
        } = data;

        let args = getArgs(data);

        return ParamsFieldView({
            itemRender: ({
                title,
                content,
                onchange
            }) => expressionView(mergeMap(getContext(data), {
                title,
                onchange,
                value: content
            })),

            onchange: (params) => {
                value.params = value.params.slice(0, value.infix).concat(params);
                onchange(value);
            },

            args: args.slice(value.infix),

            params: value.params.slice(value.infix)
        });
    };

    return {
        getPrefixParams,
        getSuffixParams
    };
};
