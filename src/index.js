'use strict';

let {
    view, n
} = require('kabanery');

let TreeOptionView = require('./component/treeOptionView');

let JsonDataView = require('./jsonDataView');

let AbstractionView = require('./abstractionView');

let PredicateView = require('./predicateView');

let VariableView = require('./variableView');

let ExpressionExpandor = require('./component/expressionExpandor');

let params = require('./params');

let {
    mergeMap
} = require('bolzano');

const LAMBDA_STYLE = require('./style');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE,
    DEFAULT_DATA_MAP
} = require('./const');

let {
    getExpressionType,
    expressionTypes,
    getPredicateMetaInfo,
    getPredicatePath,
    infixTypes,
    getDataTypePath
} = require('./model');

let {
    get
} = require('bolzano');

let funExpressionBody = require('./funExpressionBody');

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
module.exports = view((data = {}) => {
    let $style = document.getElementById('lambda-style');
    if (!$style) {
        $style = n('style id="lambda-style" type="text/css"', LAMBDA_STYLE);
        document.getElementsByTagName('head')[0].appendChild($style);
    }

    return n('div', {
        'class': 'lambda-ui'
    }, [
        expressionView(data)
    ]);
});

let expressionView = view((data, {
    update
}) => {
    data.value = data.value || {};
    data.value.currentVariables = data.value.variables || [];
    data.variables = data.variables || [];
    data.funs = data.funs || [JSON_DATA, PREDICATE, ABSTRACTION, VARIABLE];
    data.onchange = data.onchange || id;

    let {
        getSuffixParams,
        getPrefixParams
    } = params(data, {
        expressionView,
        onexpandchange: (hide, data) => {
            // close infix mode
            update([
                ['infixPath', null],
                ['value', data.value],
                ['title', '']
            ]);
        }
    });

    return () => {
        let {
            value, onchange, variables, infixPath
        } = data;

        let expresionType = getExpressionType(value.path);

        let optionsView = OptionsView({
            data, onselected: (v, path) => {
                update([
                    ['value.path', path],
                    ['showSelectTree', false]
                ]);
            }
        });

        if (expresionType === JSON_DATA) {
            let type = getDataTypePath(value.path);
            value.value = value.value === undefined ? DEFAULT_DATA_MAP[type] : value.value;
        }

        onchange(value);

        return data.infixPath ? expressionView(mergeMap(data, {
            infixPath: null,
            value: {
                path: infixPath,
                params: [value],
                infix: 1
            }
        })) : n('div', {
            style: {
                position: 'relative',
                display: 'inline-block',
                borderRadius: 5
            }
        }, [
            // expression
            n('div', {
                style: {
                    display: 'inline-block',
                    padding: 8,
                    border: '1px solid rgba(200, 200, 200, 0.4)',
                    borderRadius: 5
                }
            }, [

                !data.value.path && optionsView,

                data.value.path && [
                    expresionType === PREDICATE && PredicateView({
                        value,
                        optionsView,
                        getSuffixParams,
                        getPrefixParams
                    }),

                    expresionType === JSON_DATA && JsonDataView({
                        value, onchange, optionsView
                    }),

                    expresionType === VARIABLE && VariableView({
                        optionsView
                    }),

                    expresionType === ABSTRACTION && AbstractionView({
                        value,
                        variables,
                        optionsView,
                        onchange,
                        expressionBody: funExpressionBody(data, {
                            expressionView
                        })
                    })
                ]
            ]),

            // expandor
            n('div', {
                style: {
                    display: 'inline-block'
                }
            }, [
                data.value.path && ExpandorView({
                    onExpand: (hide) => {
                        update();
                        data.onexpandchange && data.onexpandchange(hide, data);
                    },

                    onselected: () => {
                        update();
                    },

                    data
                })
            ])
        ]);
    };
});

let ExpandorView = ({
    data,
    onExpand,
    onselected
}) => {
    let {
        predicates, expandAbility
    } = data;

    let options = expandAbility ? expandAbility(data) : infixTypes({
        predicates
    });
    return ExpressionExpandor({
        options,
        hideExpressionExpandor: data.hideExpressionExpandor,
        onExpand: (hide) => {
            data.hideExpressionExpandor = hide;
            data.infixPath = null;
            onExpand && onExpand();
        },

        onselected: (v, path) => {
            data.infixPath = path;
            data.title = get(getPredicateMetaInfo(data.predicatesMetaInfo, getPredicatePath(path)), 'args.0.name');
            data.hideExpressionExpandor = true;
            onselected && onselected(v, path);
        }
    });
};

let OptionsView = view(({
    data, onselected
}) => {
    let {
        title, value, showSelectTree, pathMapping, nameMap, expressAbility
    } = data;

    let optionData = expressAbility ? expressAbility(data) : expressionTypes(data);

    return n('div', {
        style: {
            color: '#9b9b9b',
            fontSize: 12,
            display: 'inline-block'
        }
    }, [
        TreeOptionView({
            title,
            showSelectTree,
            pathMapping,
            nameMap,
            onselected,
            path: value.path, data: optionData
        })
    ]);
});

const id = v => v;
