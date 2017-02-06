'use strict';

let {
    view, n
} = require('kabanery');

let ExpandorComponent = require('./component/expandorComponent');

let TreeOptionView = require('./view/treeOptionView');

let Expandor = require('./view/expandor');

let {
    getPrefixParamser,
    getSuffixParamser
} = require('./component/params');

let {
    mergeMap, get, map
} = require('bolzano');

let getExpressionViewer = require('./getExpressionViewer');

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
    expressionTypes,
    isUIPredicate,
    getUIPredicatePath
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
            infixPath,

            // events
            onchange,

            runLeta
        } = data;

        completeValueWithDefault(value);

        if (isUIPredicate(value.path)) {
            //
            let render = get(data.UI, getUIPredicatePath(value.path));
            return expressionView(mergeMap(data, {
                viewer: (v) => render(v, ...map(value.params.slice(1), (item) => {
                    return runLeta(item);
                })),
                value: value.params[0]
            }));
        }

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

        onchange(value);

        return getExpressionViewer(data)(
            getExpressionViewOptions(data, update)
        );
    };
});

let getExpressionViewOptions = (data, update) => {
    let {
        value,
        variables,

        // global config
        predicates,
        predicatesMetaInfo,
        UI,
        nameMap,

        // ui states
        title,
        guideLine,
        showSelectTree,

        // events
        onchange,

        runLeta
    } = data;

    let globalConfig = {
        predicates,
        runLeta,
        UI,
        predicatesMetaInfo,
        nameMap
    };

    let getOptionsView = (OptionsView = TreeOptionView) => OptionsView({
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

                getOptionsView,

                getExpandor,

                expressionType
            };
        case JSON_DATA:
            return {
                value,
                onchange,
                getOptionsView,
                getExpandor,

                expressionType
            };
        case VARIABLE:
            return {
                getOptionsView,
                getExpandor,

                expressionType
            };
        case ABSTRACTION:
            return {
                value,
                variables,

                getOptionsView,
                getExpandor,

                onchange,
                expressionBody: getAbstractionBody(),

                expressionType
            };
        default:
            return {
                getOptionsView,
                getExpandor,

                expressionType
            };
    }
};
