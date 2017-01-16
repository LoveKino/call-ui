'use strict';

let {
    n, view
} = require('kabanery');

let {
    get
} = require('bolzano');

let ParamsFieldView = require('./paramsFieldView');

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
    } = get(predicatesMetaInfo, predicatePath);

    value.params = value.params || [];

    onchange(value);

    return n('div', [
        optionsView,

        n('div', {
            style: {
                padding: 5
            }
        }, [
            ParamsFieldView({
                expressionInfo: data,
                onchange: (params) => {
                    value.params = params;
                    onchange(value);
                },
                args,
                expressionView,
                params: value.params
            })
        ])
    ]);
});

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

const id = v => v;
