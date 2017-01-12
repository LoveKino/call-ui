'use strict';

let {
    view, n
} = require('kabanery');

let {
    map, get
} = require('bolzano');

let InputList = require('kabanery-dynamic-listview/lib/inputList');

let TreeOptionView = require('./treeOptionView');

let JsonDataView = require('./jsonDataView');

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

// expression type
const EXPRESSION_TYPES = ['variable', 'data', 'abstraction', 'predicate'];

const [VARIABLE, JSON_DATA, ABSTRACTION, PREDICATE] = EXPRESSION_TYPES;

/**
 * expression user interface
 *
 * 1. user choses expression type
 * 2. define current expression type
 */
module.exports = view(({
    predicates,
    predicatesMetaInfo
}) => {
    document.getElementsByTagName('head')[0].appendChild(n('style', {
        type: 'text/css'
    }, `.lambda-variable fieldset{
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
}
    `));

    return expressionView({
        predicates,
        predicatesMetaInfo
    });
});

let expressionView = view(({
    predicates,
    predicatesMetaInfo,
    expressionType,
    path
}, {
    update
}) => {
    return n('div', {
        style: {
            display: 'inline-block',
            padding: 8,
            border: '1px solid rgba(200, 200, 200, 0.4)'
        }
    }, [
        TreeOptionView({
            data: {
                [JSON_DATA]: 1, // declare json data
                [ABSTRACTION]: 1, // declare function
                [PREDICATE]: predicates // declare function
            },
            onselected: (v, path) => {
                update([
                    ['path', path],
                    ['expressionType', getExpressionType(path)]
                ]);
            }
        }),

        expressionType && n('div', {
            style: {
                border: '1px solid rgba(200, 200, 200, 0.4)',
                marginLeft: 15,
                marginTop: 5,
                padding: 5
            }
        }, [
            expressionType === JSON_DATA ? JsonDataView({
                predicates, predicatesMetaInfo
            }) :
            expressionType === PREDICATE ? predicateView({
                path, predicates, predicatesMetaInfo
            }) :
            expressionType === ABSTRACTION ? abstractionView({
                predicates,
                predicatesMetaInfo
            }) :
            null
        ])
    ]);
});

let abstractionView = view(({
    predicates,
    predicatesMetaInfo
}) => {
    return n('div', [
        variableView({}),
        n('div', [
            n('div', {
                style: {
                    marginTop: 4
                }
            }, 'expression'),
            n('div', {
                style: {
                    margin: '10px'
                }
            }, [
                expressionView({
                    predicates,
                    predicatesMetaInfo
                })
            ])
        ])
    ]);
});

// used to define variables
let variableView = view(() => {
    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            listData: [],
            title: VARIABLE
        })
    ]);
});

let predicateView = view(({
    path,
    predicatesMetaInfo,
    predicates
}) => {
    let predicatePath = getPredicatePath(path);
    let {
        args
    } = get(predicatesMetaInfo, predicatePath);
    return n('div', [
        paramsFieldView({
            args,
            predicates,
            predicatesMetaInfo
        })
    ]);
});

let paramsFieldView = view(({
    args,
    predicates,
    predicatesMetaInfo
}) => {
    return n('div', {
        'class': 'lambda-params'
    }, [
        map(args, ({
            name
        }) => {
            return n('fieldset', {
                style: {
                    padding: '4px'
                }
            },[
                name && n('label', {
                    style: {
                        marginRight: 10
                    }
                }, name),

                expressionView({
                    predicatesMetaInfo,
                    predicates
                })
            ]);
        })
    ]);
});

let getExpressionType = (path) => {
    return path.split('.')[0];
};

let getPredicatePath = (path) => path.split('.').slice(1).join('.');
