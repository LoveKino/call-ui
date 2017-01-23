'use strict';

let {
    mergeMap
} = require('bolzano');

module.exports = (data, {
    expressionView
}) => {
    let {
        predicates,
        predicatesMetaInfo,
        expressAbility,
        nameMap,
        pathMapping,
        variables,
        value,
        onchange
    } = data;

    let expressionViewObj = mergeMap(data, {
        title: 'expression',
        value: value.expression,
        variables: variables.concat(value.currentVariables),
        onchange: (lambda) => {
            value.expression = lambda;
            onchange && onchange(value);
        },
        predicates,
        predicatesMetaInfo,
        expressAbility,
        nameMap,
        pathMapping
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
