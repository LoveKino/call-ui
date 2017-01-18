'use strict';

let {
    n, view
} = require('kabanery');

let VariableDeclareView = require('./component/variableDeclareView');

let {
    VARIABLE
} = require('./const');

module.exports = view(({
    value,
    variables,
    optionsView,
    onchange,
    expressionBody
}) => {
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
                        expressionBody.updateVariables(variables.concat(value.currentVariables));
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
                expressionBody.getView()
            ])
        ])
    ]);
});
