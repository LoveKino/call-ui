'use strict';

let {
    n, view
} = require('kabanery');

let VariableDeclareView = require('./variableDeclareView');

let {
    VARIABLE
} = require('./const');

let {
    dsl
} = require('leta');

let {
    mergeMap
} = require('bolzano');

let {
    r
} = dsl;

module.exports = view((data) => {
    let {
        value,
        variables,
        expressionView,
        optionsView,
        onchange
    } = data;

    let currentVariables = value.variables || [],
        expression;

    let getLambda = () => {
        if (expression === undefined) return new Error('expression is not defined in abstraction');
        if (expression instanceof Error) return expression;

        return r(...currentVariables, expression);
    };

    onchange(getLambda());

    let expressionViewObj = mergeMap(data, {
        title: 'expression',
        value: value.expression,
        variables: variables.concat(currentVariables),
        onchange: (lambda) => {
            expression = lambda;
            onchange(getLambda());
        }
    });

    return () => n('div', [
        optionsView,

        n('div', {
            style: {
                marginLeft: 15,
                marginTop: 5,
                padding: 5
            }
        }, [
            n('div', {
                style: {
                    border: '1px solid rgba(200, 200, 200, 0.4)',
                    borderRadius: 5,
                    padding: 5
                }
            }, [
                VariableDeclareView({
                    onchange: (v) => {
                        currentVariables = v;
                        expressionViewObj.variables = variables.concat(currentVariables);
                        onchange(getLambda());
                    },

                    variables: currentVariables,
                    prevVariables: variables,
                    title: VARIABLE,
                })
            ]),

            n('div', {
                style: {
                    marginTop: 5
                }
            }, [
                expressionView(expressionViewObj)
            ])
        ])
    ]);
});
