'use strict';

let {
    view, n
} = require('kabanery');

let EmptyExpressionView = require('./component/emptyExpressionView');

let JsonDataView = require('./component/jsonDataView');

let AbstractionView = require('./component/abstractionView');

let PredicateView = require('./component/predicateView');

let VariableView = require('./component/variableView');

let ExpandorComponent = require('./component/expandorComponent');

let TreeOptionView = require('./view/treeOptionView');

let Expandor = require('./view/expandor');

let {
    getPrefixParamser,
    getSuffixParamser
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
 * ח based on predicates and json expansion
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
 *
 * TODO: application option
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
    data = completeDataWithDefault(data);

    return () => {
        let {
            value,
            variables,
            infixPath,

            // global config
            predicates,
            predicatesMetaInfo,
            nameMap,

            // ui states
            title,
            guideLine,
            showSelectTree,

            // events
            onchange
        } = data;

        let globalConfig = {
            predicates,
            predicatesMetaInfo,
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

        let optionsView = TreeOptionView({
            path: value.path,
            data: expressionTypes(data),
            title,
            guideLine,
            showSelectTree,
            nameMap,
            onselected: (v, path) => {
                update([
                    ['value.path', path],
                    ['showSelectTree', false]
                ]);
            }
        });

        let getExpandor = (ExpandorView = Expandor) => data.value.path && ExpandorComponent({
            onExpand: (hide) => {
                update();
                data.onexpandchange && data.onexpandchange(hide, data);
            },

            onselected: () => {
                update();
            },

            data,

            ExpandorView
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

        let getExpressionViewOptions = () => {
            let expressionType = getExpressionType(value.path);
            switch (expressionType) {
                case PREDICATE:
                    return {
                        getPrefixParams: getPrefixParamser(data, {
                            // prefix param item
                            itemRender: prefixParamItemRender
                        }),

                        value,

                        getSuffixParams: getSuffixParamser(data, {
                            expressionView,
                            // suffix param item
                            itemRender: suffixParamItemRender
                        }),

                        optionsView,

                        getExpandor
                    };
                case JSON_DATA:
                    return {
                        value,
                        onchange,
                        optionsView,
                        getExpandor
                    };
                case VARIABLE:
                    return {
                        optionsView,
                        getExpandor
                    };
                case ABSTRACTION:
                    return {
                        value,
                        variables,

                        optionsView,
                        getExpandor,

                        onchange,
                        expressionBody: getAbstractionBody()
                    };
                default:
                    return {
                        optionsView,
                        getExpandor
                    };
            }
        };

        onchange(value);

        return getExpressionViewer(data)(getExpressionViewOptions());
    };
});

/**
 * choose the viewer to render expression
 */
let getExpressionViewer = ({
    value
}) => {
    let expressionType = getExpressionType(value.path);

    switch (expressionType) {
        case PREDICATE:
            return PredicateView;
        case JSON_DATA:
            return JsonDataView;
        case VARIABLE:
            return VariableView;
        case ABSTRACTION:
            return AbstractionView;
        default:
            return EmptyExpressionView;
    }
};
