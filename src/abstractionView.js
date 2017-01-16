'use strict';

let {
    n, view
} = require('kabanery');

let VariableDeclareView = require('./variableDeclareView');

let {
    VARIABLE
} = require('./const');

let {
    mergeMap
} = require('bolzano');

module.exports = view((data) => {
    let {
        value,
        variables,
        expressionView,
        optionsView,
        onchange
    } = data;

    value.currentVariables = value.variables || [];

    onchange(value);

    let expressionViewObj = mergeMap(data, {
        title: 'expression',
        value: value.expression,
        variables: variables.concat(value.currentVariables),
        onchange: (lambda) => {
            value.expression = lambda;
            onchange(value);
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
                        value.currentVariables = v;
                        expressionViewObj.variables = variables.concat(value.currentVariables);
                        onchange(value);
                    },

                    variables: value.currentVariables,
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
