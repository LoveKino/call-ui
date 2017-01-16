'use strict';

let {
    n, view
} = require('kabanery');

let {
    get
} = require('bolzano');

let {
    dsl
} = require('leta');

let ParamsFieldView = require('./paramsFieldView');

let method = dsl.require;

module.exports = view((data) => {
    let {
        value,
        predicatesMetaInfo,
        expressionView,
        onchange = id
    } = data;

    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = get(predicatesMetaInfo, predicatePath);

    value.params = value.params || [];

    let getLambda = () => {
        return method(predicatePath)(...value.params);
    };

    onchange(getLambda());

    return n('div', {
        style: {
            marginLeft: 15,
            marginTop: 5,
            padding: 5
        }
    }, [
        ParamsFieldView({
            expressionInfo: data,
            onchange: (params) => {
                value.params = params;
                onchange(getLambda());
            },
            args,
            expressionView,
            params: value.params
        })
    ]);
});

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

const id = v => v;
