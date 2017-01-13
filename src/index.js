'use strict';

let {
    view, n
} = require('kabanery');

let TreeOptionView = require('./treeOptionView');

let JsonDataView = require('./jsonDataView');

let AbstractionView = require('./abstractionView');

let PredicateView = require('./predicateView');

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

let {
    JSON_DATA,
    ABSTRACTION,
    PREDICATE
} = require('./const');

const LAMBDA_STYLE = `.lambda-variable fieldset{
    display: inline-block;
    border: 1px solid rgba(200, 200, 200, 0.4);
    padding: 1px 4px;
}

.lambda-variable input{
    width: 30px;
    outline: none;
} 

.lambda-params fieldset{
    padding: 1px 4px;
    border: 0;
}`;

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
        value,
        predicates,
        predicatesMetaInfo,
        variables = [], onchange = id
    } = data;

    value = data.value = data.value || {};

    let expressionTypes = {
        [JSON_DATA]: 1, // declare json data
        [ABSTRACTION]: 1, // declare function
        [PREDICATE]: predicates // declare function
    };
    if (variables.length) {
        expressionType.variable = variables;
    }
    let expressionType = getExpressionType(value.path);

    return n('div', {
        style: {
            display: 'inline-block',
            padding: 8,
            border: '1px solid rgba(200, 200, 200, 0.4)'
        }
    }, [
        TreeOptionView({
            path: value.path,
            data: expressionTypes,
            onselected: (v, path) => {
                update([
                    ['value.path', path]
                ]);
            }
        }),

        expressionType === JSON_DATA ? JsonDataView({
            predicates, predicatesMetaInfo, value,
            onchange
        }) :

        expressionType === PREDICATE ? PredicateView({
            value,
            predicates,
            predicatesMetaInfo,
            expressionView,
            onchange
        }) :

        expressionType === ABSTRACTION ? AbstractionView({
            value,
            predicates,
            predicatesMetaInfo,
            expressionView,
            onchange
        }) :

        null
    ]);
});

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};

const id = v => v;
