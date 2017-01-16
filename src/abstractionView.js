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
        value: value.expression,
        variables: variables.concat(currentVariables),
        onchange: (lambda) => {
            expression = lambda;
            onchange(getLambda());
        }
    });

    return () => n('div', {
        style: {
            marginLeft: 15,
            marginTop: 5,
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
        }),

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
                expressionView(expressionViewObj)
            ])
        ])
    ]);
});
