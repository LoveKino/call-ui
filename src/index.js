'use strict';

let {
    view, n
} = require('kabanery');

let JsonDataView = require('./component/jsonDataView');

let AbstractionView = require('./component/abstractionView');

let PredicateView = require('./component/predicateView');

let VariableView = require('./component/variableView');

let ExpandorView = require('./component/expandorView');

let funExpressionBody = require('./component/funExpressionBody');

let OptionsView = require('./component/optionsView');

let {
    getSuffixParams,
    getPrefixParams
} = require('./component/params');

let {
    mergeMap
} = require('bolzano');

const style = require('./style');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = require('./const');

let {
    getExpressionType,
    completeDataWithDefault,
    completeValueWithDefault
} = require('./model');

/**
 * lambda UI editor
 *
 * π calculus
 *
 * e ::= x              a variable
 *   |   חx.e           an abstraction (function)
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
 *    חx₁x₂...x.e
 *
 * 5. application
 *    e₁e₂e₃...
 *
 * π based on predicates and json expansion
 *
 * e ::= json                    as meta data, also a pre-defined π expression
 *   |   x                       variable
 *   |   predicate               predicate is a pre-defined abstraction
 *   |   חx.e                    abstraction
 *   |   e1e2                    application
 */

/**
 * expression user interface
 *
 * 1. user choses expression type
 * 2. define current expression type
 *
 * data = {
 *      predicates,
 *      predicatesMetaInfo: {
 *          ... {
 *              args: [{
 *                  name,
 *                  defaultValue: value
 *              }]
 *          }
 *      },
 *
 *      value: {
 *          path
 *      }
 * }
 */
module.exports = view((data = {}) => {
    style({
        style: data.styleStr
    });

    return n('div', {
        'class': 'lambda-ui'
    }, [
        expressionView(data)
    ]);
});

let expressionView = view((data, {
    update
}) => {
    completeDataWithDefault(data);

    return () => {
        let {
            value,
            variables,
            infixPath,

            // global config
            predicates,
            predicatesMetaInfo,
            expressAbility,
            nameMap,
            pathMapping,

            // events
            onchange
        } = data;

        completeValueWithDefault(value);

        if (data.infixPath) {
            return expressionView(mergeMap(data, {
                infixPath: null,
                value: {
                    path: infixPath,
                    params: [value],
                    infix: 1
                }
            }));
        }

        let expresionType = getExpressionType(value.path);

        let optionsView = OptionsView({
            data, onselected: (v, path) => {
                update([
                    ['value.path', path],
                    ['showSelectTree', false]
                ]);
            }
        });

        let expandor = data.value.path && ExpandorView({
            onExpand: (hide) => {
                update();
                data.onexpandchange && data.onexpandchange(hide, data);
            },

            onselected: () => {
                update();
            },

            data
        });

        onchange(value);

        return n('div', {
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
                        prefixParams: getPrefixParams(data, {
                            itemRender: ({
                                title,
                                content,
                                onchange
                            }) => expressionView({
                                value: content,
                                title,
                                onchange,
                                predicates,
                                predicatesMetaInfo,
                                variables,
                                nameMap,
                                pathMapping,
                                expressAbility,

                                onexpandchange: (hide, data) => {
                                    // close infix mode
                                    update([
                                        ['infixPath', null],
                                        ['value', data.value],
                                        ['title', '']
                                    ]);
                                }
                            })
                        }),

                        value,
                        optionsView,

                        suffixParams: getSuffixParams(data, {
                            expressionView,
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
                            })
                        })
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
            expandor
        ]);
    };
});
