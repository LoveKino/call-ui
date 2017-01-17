'use strict';

let {
    n, view
} = require('kabanery');

let ParamsFieldView = require('./paramsFieldView');

let {
    getPredicatePath, getPredicateMetaInfo, getContext
} = require('./model');

module.exports = view((data) => {
    let {
        value,
        predicatesMetaInfo,
        expressionView,
        optionsView,
        onchange = id,
        onexpandchange,
        infix = 0
    } = data;

    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath);

    value.params = value.params || [];

    onchange(value);

    return n('div', [
        ParamsFieldView({
            context: getContext(data),
            onexpandchange,
            onchange: (params) => {
                value.params = params.concat(value.params.slice(infix));
                onchange(value);
            },
            args: args.slice(0, infix),
            expressionView,
            params: value.params.slice(0, infix)
        }),

        optionsView,

        n('div', {
            style: {
                padding: 5,
                display: infix ? 'inline-block' : 'block'
            }
        }, [
            ParamsFieldView({
                context: getContext(data),
                onchange: (params) => {
                    value.params = value.params.slice(0, infix).concat(params);
                    onchange(value);
                },
                args: args.slice(infix),
                expressionView,
                params: value.params.slice(infix)
            })
        ])
    ]);
});

const id = v => v;
