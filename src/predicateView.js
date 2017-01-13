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
    path,
    predicatesMetaInfo,
    predicates,
    expressionView,
    onchange = id
}) => {
    let predicatePath = getPredicatePath(path);
    let {
        args
    } = get(predicatesMetaInfo, predicatePath);

    onchange(
        method(predicatePath)()
    );

    return n('div', [
        ParamsFieldView({
            args,
            predicates,
            predicatesMetaInfo,
            expressionView,
            onchange: (params) => {
                onchange(
                    method(predicatePath)(...params)
                );
            }
        })
    ]);
});

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

const id = v => v;
