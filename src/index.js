'use strict';

let {
    view, n
} = require('kabanery');

let TreeOptionView = require('./treeOptionView');

let JsonDataView = require('./jsonDataView');

let AbstractionView = require('./abstractionView');

let PredicateView = require('./predicateView');

let VariableView = require('./variableView');

let ExpressionExpandor = require('./expressionExpandor');

const LAMBDA_STYLE = require('./style');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE,
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL
} = require('./const');

let {
    mergeMap, reduce
} = require('bolzano');

/**
 * lambda UI editor
 *
 * π calculus
 *
 * e ::= x              a variable
 *   |   πx.e           an abstraction (function)
 *   |   e₁e₂           a (function) application
 *
 * 1. meta data
 *    json
 *
 * 2. predicate
 *    f(x, ...)
 *
 * 3. variable
 *    x
 *
 * 4. abstraction
 *    πx₁x₂...x.e
 *
 * 5. application
 *    e₁e₂e₃...
 *
 * π based on predicates and json expansion
 *
 * e ::= json                    as meta data, also a pre-defined π expression
 *   |   x                       variable
 *   |   predicate               predicate is a pre-defined abstraction
 *   |   πx.e                    abstraction
 *   |   e1e2                    application
 *
 */

/**
 * expression user interface
 *
 * 1. user choses expression type
 * 2. define current expression type
 */
module.exports = view((data) => {
    let $style = document.getElementById('lambda-style');
    if (!$style) {
        $style = n('style id=lambda-style type="text/css"', LAMBDA_STYLE);
        document.getElementsByTagName('head')[0].appendChild($style);
    }

    return n('div', {
        'class': 'lambda-ui'
    }, [
        expressionView(data)
    ]);
});

let expressionViewMap = {
    [JSON_DATA]: JsonDataView,
    [PREDICATE]: PredicateView,
    [ABSTRACTION]: AbstractionView,
    [VARIABLE]: VariableView
};

let expressionView = view((data, {
    update
}) => {
    data.value = data.value || {};
    data.variables = data.variables || [];
    data.funs = data.funs || [JSON_DATA, PREDICATE, ABSTRACTION, VARIABLE];

    let hideExpressionExpandor = true;

    return () => {
        let optionsView = n('div', {
            style: {
                color: '#9b9b9b',
                fontSize: 12,
                display: 'inline-block'
            }
        }, [
            TreeOptionView({
                title: data.title,
                path: data.value.path,
                showSelectTree: data.showSelectTree,
                data: () => expressionTypes(data),
                onselected: (v, path) => {
                    update([
                        ['value.path', path]
                    ]);
                }
            })
        ]);

        return n('div', {
            style: {
                position: 'relative',
                display: 'inline-block',
                border: !hideExpressionExpandor ? '1px solid rgba(200, 200, 200, 0.4)' : '0',
                padding: !hideExpressionExpandor ? 5 : 0,
                borderRadius: 5
            }
        }, [
            n('div', {
                style: {
                    display: 'inline-block',
                    padding: 8,
                    border: '1px solid rgba(200, 200, 200, 0.4)',
                    borderRadius: 5
                }
            }, [!data.value.path && optionsView,

                data.value.path && expressionViewMap[
                    getExpressionType(data.value.path)
                ](mergeMap(data, {
                    expressionView,
                    optionsView
                }))
            ]),

            n('div', {
                style: {
                    display: 'inline-block'
                }
            }, [
                data.value.path && ExpressionExpandor({
                    body: () => {
                        return n('div', {
                            style: {
                                display: 'inline-block',
                                marginLeft: 15
                            }
                        }, expressionView(mergeMap(data, {
                            value: {},
                            funs: [PREDICATE],
                            infix: true,
                            title: 'operation'
                        })));
                    },

                    hideExpressionExpandor: hideExpressionExpandor,
                    onchange: (hide) => {
                        hideExpressionExpandor = hide;
                        update();
                    }
                })
            ])
        ]);
    };
});

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};

let expressionTypes = (data) => {
    let types = {
        [JSON_DATA]: {
            [NUMBER]: 1,
            [BOOLEAN]: 1,
            [STRING]: 1,
            [JSON_TYPE]: 1,
            [NULL]: 1
        }, // declare json data
        [PREDICATE]: data.predicates, // declare function
        [ABSTRACTION]: 1 // declare function
    };

    if (data.variables.length) {
        types.variable = reduce(data.variables, (prev, cur) => {
            prev[cur] = 1;
            return prev;
        }, {});
    }

    return reduce(data.funs, (prev, name) => {
        if (types[name]) {
            prev[name] = types[name];
        }
        return prev;
    }, {});
};
