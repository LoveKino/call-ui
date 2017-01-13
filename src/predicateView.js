'use strict';

let {
    n, view
} = require('kabanery');

let {
    get, map
} = require('bolzano');

let {
    dsl
} = require('leta');

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
        paramsFieldView({
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

let paramsFieldView = view(({
    args,
    predicates,
    predicatesMetaInfo,
    expressionView,
    onchange = id
}) => {
    let params = [];

    return () => n('div', {
        'class': 'lambda-params'
    }, [
        map(args, ({
            name
        }, index) => {
            return n('fieldset', {
                style: {
                    padding: '4px'
                }
            }, [
                name && n('label', {
                    style: {
                        marginRight: 10
                    }
                }, name),

                expressionView({
                    predicatesMetaInfo,
                    predicates,
                    onchange: (expressionValue) => {
                        params[index] = expressionValue;

                        onchange(params);
                    }
                })
            ]);
        })
    ]);
});

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

const id = v => v;
