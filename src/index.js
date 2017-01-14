'use strict';

let {
    view, n
} = require('kabanery');

let TreeOptionView = require('./treeOptionView');

let JsonDataView = require('./jsonDataView');

let AbstractionView = require('./abstractionView');

let PredicateView = require('./predicateView');

let VariableView = require('./variableView');

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
module.exports = view(({
    predicates,
    predicatesMetaInfo,
    onchange,
    value
}) => {
    document.getElementsByTagName('head')[0].appendChild(n('style', {
        type: 'text/css'
    }, LAMBDA_STYLE));

    return expressionView({
        predicates,
        predicatesMetaInfo,
        onchange,
        value
    });
});

let expressionView = view((data, {
    update
}) => {
    let {
        predicates,
    } = data;

    data.value = data.value || {};
    data.variables = data.variables || [];

    let expressionTypes = () => {
        let types = {
            [JSON_DATA]: {
                [NUMBER]: 1,
                [BOOLEAN]: 1,
                [STRING]: 1,
                [JSON_TYPE]: 1,
                [NULL]: 1
            }, // declare json data
            [ABSTRACTION]: 1, // declare function
            [PREDICATE]: predicates // declare function
        };
        if (data.variables.length) {
            types.variable = reduce(data.variables, (prev, cur) => {
                prev[cur] = 1;
                return prev;
            }, {});
        }

        return types;
    };
    let expressionType = getExpressionType(data.value.path);

    let viewObject = mergeMap(data, {
        expressionView
    });

    return n('div', {
        style: {
            display: 'inline-block',
            padding: 8,
            border: '1px solid rgba(200, 200, 200, 0.4)'
        }
    }, [
        TreeOptionView({
            path: data.value.path,
            data: expressionTypes,
            onselected: (v, path) => {
                update([
                    ['value.path', path]
                ]);
            }
        }),

        expressionType === JSON_DATA ? JsonDataView(viewObject) :

        expressionType === PREDICATE ? PredicateView(viewObject) :

        expressionType === ABSTRACTION ? AbstractionView(viewObject) :

        expressionType === VARIABLE ? VariableView(viewObject) :

        null
    ]);
});

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};
