'use strict';

let {
    mergeMap
} = require('bolzano');

module.exports = (data, {
    expressionView
}) => {
    let {
        value,
        variables,
        onchange
    } = data;

    let expressionViewObj = mergeMap(data, {
        title: 'expression',
        value: value.expression,
        variables: variables.concat(value.currentVariables),
        onchange: (lambda) => {
            value.expression = lambda;
            onchange(value);
        }
    });

    return {
        getView: () => {
            return expressionView(expressionViewObj);
        },

        updateVariables: (vars) => {
            expressionViewObj.variables = vars;
        }
    };
};
