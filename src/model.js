'use strict';

let {
    map
} = require('bolzano');
let {
    dsl
} = require('leta');

let {
    v, r
} = dsl;

let method = dsl.require;

let {
    PREDICATE, VARIABLE, JSON_DATA, ABSTRACTION, DEFAULT_DATA_MAP
} = require('./const');

let getLambda = (value) => {
    let expressionType = getExpressionType(value.path);
    let predicatePath = getPredicatePath(value.path);
    let type = getDataTypePath(value.path);

    switch (expressionType) {
        case VARIABLE:
            return v(getVariableName(value.path));
        case ABSTRACTION:
            if (value.expression === undefined) return new Error('expression is not defined in abstraction');
            if (value.expression instanceof Error) return value.expression;
            return r(...value.currentVariables, getLambda(value.expression));
        case PREDICATE:
            return method(predicatePath)(...map(value.params, getLambda));
        case JSON_DATA:
            return value.value || DEFAULT_DATA_MAP[type];
    }
};

let getVariableName = (path) => {
    let parts = path.split('.');
    parts.shift();
    return parts.join('.');
};

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};

let getPredicatePath = (path) => path.split('.').slice(1).join('.');

let getDataTypePath = (path = '') => path.split('.').slice(1).join('.');

module.exports = {
    getLambda
};
