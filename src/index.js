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

let {
    mergeMap
} = require('bolzano');

const LAMBDA_STYLE = require('./style');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = require('./const');

let {
    getExpressionType,
    expressionTypes,
    getPredicateMetaInfo,
    getPredicatePath
} = require('./model');

let {
    get
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

    let {
        predicates, predicatesMetaInfo
    } = data;

    return data.value.infixPath ? expressionView({
        value: {
            path: data.value.infixPath,
            infix: 1,
            params: [{
                path: data.value.path
            }]
        },

        predicates,

        predicatesMetaInfo,

        prevExpressionViews: [getPrevExpressionView({
            data, update
        })],

        expressionView,
        optionsView: getOptionsView({
            data, update
        })
    }) : getPrevExpressionView({
        data, update
    });
});

let getPrevExpressionView = ({
    data, update
}) => {
    let optionsView = getOptionsView({
        data, update
    });

    return n('div', {
        style: {
            position: 'relative',
            display: 'inline-block',
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
        }, [

            !data.value.path && optionsView,

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
                predicates: data.predicates,
                hideExpressionExpandor: data.value.hideExpressionExpandor,
                onExpand: (hide) => {
                    if (data.value.infixPath) {
                        data.value.hideExpressionExpandor = true;
                    } else {
                        data.value.hideExpressionExpandor = hide;
                    }
                    data.value.infixPath = null;
                    data.value.title = null;
                    update();
                },

                onselected: (v, path) => {
                    data.value.infixPath = path;
                    let {
                        args
                    } = getPredicateMetaInfo(data.predicatesMetaInfo, getPredicatePath(path));
                    args = args || [];
                    data.value.title = get(args, '0.name');
                    data.value.hideExpressionExpandor = true;
                    update();
                }
            })
        ])
    ]);
};

let getOptionsView = ({
    data, update
}) => {
    return n('div', {
        style: {
            color: '#9b9b9b',
            fontSize: 12,
            display: 'inline-block'
        }
    }, [
        TreeOptionView({
            title: data.value.title,
            path: data.value.path,
            showSelectTree: data.value.showSelectTree,
            data: () => expressionTypes(data),
            onselected: (v, path) => {
                update([
                    ['value.path', path]
                ]);
            }
        })
    ]);
};
