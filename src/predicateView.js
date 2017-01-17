'use strict';

let {
    n, view
} = require('kabanery');

let ParamsFieldView = require('./paramsFieldView');

let {
    getPredicatePath, getPredicateMetaInfo
} = require('./model');

module.exports = view((data) => {
    let {
        value,
        predicatesMetaInfo,
        expressionView,
        optionsView,
        onchange = id
    } = data;

    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath);

    value.params = value.params || [];

    value.infix = value.infix || 0;

    onchange(value);

    return n('div', [
        ParamsFieldView({
            expressionInfo: data,
            onchange: (params) => {
                value.params = value.params.slice(0, value.infix).concat(params);
                onchange(value);
            },
            args: args.slice(0, value.infix),
            expressionView,
            params: value.params.slice(0, value.infix)
        }),

        optionsView,

        n('div', {
            style: {
                padding: 5,
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            ParamsFieldView({
                context: getParamContext(data),
                onchange: (params) => {
                    value.params = value.params.slice(0, value.infix).concat(params);
                    onchange(value);
                },
                args: args.slice(value.infix),
                expressionView,
                params: value.params.slice(value.infix)
            })
        ])
    ]);
});

let getParamContext = ({
    predicates,
    predicatesMetaInfo,
    variables
}) => {
    return {
        predicates,
        predicatesMetaInfo,
        variables
    };
};

const id = v => v;
