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
    predicates,
    predicatesMetaInfo,
    expressionView,
    onchange = v => v
}) => {
    let variables = [],
        expression;

    let getAbstraction = () => {
        if (expression === undefined) return new Error('expression is not defined in abstraction');
        if (expression instanceof Error) return expression;

        return r(...variables, expression);
    };

    return () => n('div', [
        VariableView({
            title: VARIABLE,
            onchange: (vars) => {
                variables = vars;

                onchange(getAbstraction());
            }
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
                    predicates,
                    predicatesMetaInfo,
                    onchange: (lambda) => {
                        expression = lambda;

                        onchange(getAbstraction());
                    }
                })
            ])
        ])
    ]);
});
