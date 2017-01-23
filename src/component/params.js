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

module.exports = (data, {
    expressionView, onexpandchange
}) => {
    let getPrefixParams = () => {
        let {
            predicates,
            predicatesMetaInfo,
            expressAbility,
            nameMap,
            pathMapping,
            variables,
            value,
            onchange = id
        } = data;

        let args = getArgs(data);

        return ParamsFieldView({
            itemRender: ({
                title,
                content,
                onchange
            }) => expressionView({
                title,
                onchange,
                onexpandchange,
                predicates,
                predicatesMetaInfo,
                variables,
                nameMap,
                pathMapping,
                expressAbility,
                value: content,
            }),

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
            predicates,
            predicatesMetaInfo,
            expressAbility,
            nameMap,
            pathMapping,
            variables,
            value,
            onchange = id
        } = data;

        let args = getArgs(data);

        return ParamsFieldView({
            itemRender: ({
                title,
                content,
                onchange
            }) => expressionView({
                title,
                onchange,
                predicates,
                predicatesMetaInfo,
                nameMap,
                pathMapping,
                variables,
                expressAbility,
                value: content,
            }),

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
