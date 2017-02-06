'use strict';

let {
    dsl, interpreter
} = require('leta');

let {
    PREDICATE, VARIABLE, JSON_DATA, ABSTRACTION, APPLICATION,
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, DEFAULT_DATA_MAP
} = require('../const');

let {
    reduce, get, forEach, map
} = require('bolzano');

let {
    isFunction, isObject
} = require('basetype');

let getLambdaUiValue = require('./getLambdaUiValue');

let {
    v, r, method, getJson
} = dsl;

/**
 * get lambda from lambda-ui value
 *
 * lambda ui value = {
 *     path,
 *
 *     expression,    // for abstraction
 *
 *     currentVariables,    // for abstraction
 *
 *     params,    // predicate
 *
 *     value    // json data
 * }
 */

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
        case APPLICATION:
            // TODO
    }
};

let runner = (predicates) => {
    let run = interpreter(predicates);

    return (v) => {
        let ret = getLambda(v);
        if (ret instanceof Error) {
            return ret;
        }
        try {
            return run(getJson(ret));
        } catch (err) {
            return err;
        }
    };
};

let getVariableName = (path) => {
    let parts = path.split('.');
    parts.shift();
    return parts.join('.');
};

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};

let getPredicatePath = (path = '') => path.split('.').slice(1).join('.');

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
        [ABSTRACTION]: 1, // declare function
        [APPLICATION]: 1
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
    return get(predicatesMetaInfo, predicatePath) || {};
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

let getDataTypePath = (path = '') => path.split('.').slice(1).join('.');

let completeDataWithDefault = (data) => {
    data.value = data.value || {};
    data.value.currentVariables = data.value.variables || [];
    data.variables = data.variables || [];
    data.funs = data.funs || [JSON_DATA, PREDICATE, ABSTRACTION, VARIABLE];
    data.onchange = data.onchange || id;
    data.predicates = data.predicates || {};
    data.predicatesMetaInfo = data.predicatesMetaInfo || {};

    // TODO complete predicate meta info
    completePredicatesMetaInfo(data.predicates, data.predicatesMetaInfo);

    // make title
    let expresionType = getExpressionType(data.value.path);
    if (expresionType === PREDICATE) {
        let predicatePath = getPredicatePath(data.value.path);
        let {
            title
        } = getPredicateMetaInfo(data.predicatesMetaInfo, predicatePath) || {};
        if (title) {
            data.title = title;
        }
    }

    return data;
};

let completePredicatesMetaInfo = (predicates, predicatesMetaInfo) => {
    forEach(predicates, (v, name) => {
        predicatesMetaInfo[name] = predicatesMetaInfo[name] || {};

        if (isFunction(v) && !predicatesMetaInfo[name].args) {
            predicatesMetaInfo[name].args = map(new Array(v.length), () => {
                return {};
            });
        } else if (v && isObject(v)) {
            completePredicatesMetaInfo(v, predicatesMetaInfo[name]);
        }
    });
};

let completeValueWithDefault = (value) => {
    let expresionType = getExpressionType(value.path);
    if (expresionType === JSON_DATA) {
        let type = getDataTypePath(value.path);
        value.value = value.value === undefined ? DEFAULT_DATA_MAP[type] : value.value;
    } else if (expresionType === PREDICATE) {
        value.params = value.params || [];
        value.infix = value.infix || 0;
    }
    return value;
};

let id = v => v;

module.exports = {
    completeDataWithDefault,
    getLambda,
    runner,
    getExpressionType,
    getPredicatePath,
    getVariableName,
    expressionTypes,
    infixTypes,
    getPredicateMetaInfo,
    getContext,
    getDataTypePath,
    completeValueWithDefault,

    getLambdaUiValue
};
