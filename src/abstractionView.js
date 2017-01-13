'use strict';

let {
    n, view
} = require('kabanery');

let VariableView = require('./variableView');

let {
    VARIABLE
} = require('./const');

let {
    dsl
} = require('leta');

let {
    r
} = dsl;

module.exports = view(({
    value,
    predicates,
    predicatesMetaInfo,
    expressionView,
    onchange = v => v
}) => {
    let variables = value.variables || [],
        expression;

    let getLambda = () => {
        if (expression === undefined) return new Error('expression is not defined in abstraction');
        if (expression instanceof Error) return expression;

        return r(...variables, expression);
    };

    onchange(getLambda());

    return () => n('div', {
        style: {
            border: '1px solid rgba(200, 200, 200, 0.4)',
            marginLeft: 15,
            marginTop: 5,
            padding: 5
        }
    }, [
        VariableView({
            onchange: (vars) => {
                variables = vars;

                onchange(getLambda());
            },

            variables,
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
                expressionView({
                    value: value.expression,
                    predicates,
                    predicatesMetaInfo,
                    onchange: (lambda) => {
                        expression = lambda;

                        onchange(getLambda());
                    }
                })
            ])
        ])
    ]);
});
