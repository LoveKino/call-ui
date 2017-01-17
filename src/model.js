'use strict';

let {
    map
} = require('bolzano');

let {
    dsl
} = require('leta');

let {
    PREDICATE, VARIABLE, JSON_DATA, ABSTRACTION,
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL
} = require('./const');

let {
    reduce, get
} = require('bolzano');

let {
    v, r
} = dsl;

let method = dsl.require;

let getLambda = (value) => {
    let expressionType = getExpressionType(value.path);
    let predicatePath = getPredicatePath(value.path);

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
            return value.value;
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

let expressionTypes = ({
    predicates,
    variables,
    funs
}) => {
    let types = {
        [JSON_DATA]: {
            [NUMBER]: 1,
            [BOOLEAN]: 1,
            [STRING]: 1,
            [JSON_TYPE]: 1,
            [NULL]: 1
        }, // declare json data
        [PREDICATE]: predicates, // declare function
        [ABSTRACTION]: 1 // declare function
    };

    if (variables.length) {
        types.variable = reduce(variables, (prev, cur) => {
            prev[cur] = 1;
            return prev;
        }, {});
    }

    return reduce(funs, (prev, name) => {
        if (types[name]) {
            prev[name] = types[name];
        }
        return prev;
    }, {});
};

let infixTypes = ({
    predicates
}) => {
    return {
        [PREDICATE]: predicates
    };
};

let getPredicateMetaInfo = (predicatesMetaInfo, predicatePath) => {
    return get(predicatesMetaInfo, predicatePath);
};

let getContext = ({
    predicates,
    predicatesMetaInfo,
    variables,
    funs,
    pathMapping,
    nameMap
}) => {
    return {
        predicates,
        predicatesMetaInfo,
        variables,
        funs,
        pathMapping,
        nameMap
    };
};

module.exports = {
    getLambda,
    getExpressionType,
    getPredicatePath,
    getVariableName,
    expressionTypes,
    infixTypes,
    getPredicateMetaInfo,
    getContext
};
