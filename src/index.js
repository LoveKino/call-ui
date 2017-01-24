'use strict';

let {
    view, n
} = require('kabanery');

let JsonDataView = require('./component/jsonDataView');

let AbstractionView = require('./component/abstractionView');

let PredicateView = require('./component/predicateView');

let VariableView = require('./component/variableView');

let ExpandorView = require('./component/expandorView');

let TreeOptionView = require('./view/treeOptionView');

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
    completeValueWithDefault,
    expressionTypes
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

            // ui states
            title,
            showSelectTree,

            // events
            onchange
        } = data;

        let globalConfig = {
            predicates,
            predicatesMetaInfo,
            expressAbility,
            nameMap
        };

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

        let optionsView = TreeOptionView({
            path: value.path,
            data: expressAbility ? expressAbility(data) : expressionTypes(data),
            title,
            showSelectTree,
            nameMap,
            onselected: (v, path) => {
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

        let getAbstractionBody = () => {
            let expressionViewObj = mergeMap(globalConfig, {
                title: 'expression',
                value: value.expression,
                variables: variables.concat(value.currentVariables),
                onchange: (lambda) => {
                    value.expression = lambda;
                    onchange && onchange(value);
                }
            });

            return {
                getView: () => {
                    return expressionView(expressionViewObj);
                },

                updateVariables: (vars) => {
                    expressionViewObj.variables = vars;
                }
            };
        };

        let prefixParamItemRender = ({
            title,
            content,
            onchange
        }) => expressionView(mergeMap(globalConfig, {
            value: content,
            title,
            onchange,
            variables,

            onexpandchange: (hide, data) => {
                // close infix mode
                update([
                    ['infixPath', null],
                    ['value', data.value],
                    ['title', '']
                ]);
            }
        }));

        let suffixParamItemRender = ({
            title,
            content,
            onchange
        }) => expressionView(mergeMap(globalConfig, {
            title,
            onchange,
            variables,
            value: content,
        }));

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
                            // prefix param item
                            itemRender: prefixParamItemRender
                        }),

                        value,
                        optionsView,

                        suffixParams: getSuffixParams(data, {
                            expressionView,
                            // suffix param item
                            itemRender: suffixParamItemRender
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
                        expressionBody: getAbstractionBody()
                    })
                ]
            ]),

            // expandor
            expandor
        ]);
    };
});
