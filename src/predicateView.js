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

module.exports = view(({
    value,
    predicatesMetaInfo,
    predicates,
    expressionView,
    onchange = id
}) => {
    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = get(predicatesMetaInfo, predicatePath);

    onchange(
        method(predicatePath)()
    );

    return n('div', {
        style: {
            border: '1px solid rgba(200, 200, 200, 0.4)',
            marginLeft: 15,
            marginTop: 5,
            padding: 5
        }
    }, [
        ParamsFieldView({
            args,
            predicates,
            predicatesMetaInfo,
            expressionView,
            params: value.params,
            onchange: (params) => {
                value.params = params;
                onchange(
                    method(predicatePath)(...params)
                );
            }
        })
    ]);
});

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

const id = v => v;
