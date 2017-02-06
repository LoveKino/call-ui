'use strict';

let {
    dsl
} = require('leta');

let {
    destruct,

    APPLICATION_PREFIX,
    PREDICATE_PREFIX,
    PREDICATE_VARIABLE_PREFIX,
    VARIABLE_PREFIX,
    META_DATA_PREFIX,
    ABSTRACTION_PREFIX
} = dsl;

let {
    JSON_DATA,
    VARIABLE,
    ABSTRACTION,
    PREDICATE,

    NUMBER,
    BOOLEAN,
    STRING,
    NULL,
    JSON_TYPE
} = require('../const');

let {
    compact, map
} = require('bolzano');

let {
    isString, isNumber, isBool, isNull, isObject
} = require('basetype');

/**
 * lambda ui value = {
 *     path,
 *
 *     expression,    // for abstraction
 *
 *     variables,    // for abstraction
 *
 *     params,    // predicate
 *
 *     value    // json data
 * }
 */

let getLambdaUiValue = (lambdaJson) => {
    let {
        type,
        metaData,

        variableName,

        abstractionArgs,
        abstractionBody,

        predicateName,
        predicateParams
    } = destruct(lambdaJson);

    switch (type) {
        case META_DATA_PREFIX:
            return {
                path: compact([JSON_DATA, getMetaType(metaData)]).join('.'),
                value: metaData
            };
        case VARIABLE_PREFIX:
            return {
                path: [VARIABLE, variableName].join('.')
            };
        case ABSTRACTION_PREFIX:
            return {
                path: ABSTRACTION,
                expression: getLambdaUiValue(abstractionBody),
                variables: abstractionArgs
            };
        case PREDICATE_PREFIX:
            return {
                path: compact([PREDICATE, predicateName]).join('.'),
                params: map(predicateParams, getLambdaUiValue)
            };
        case APPLICATION_PREFIX:
            // TODO
            break;
        case PREDICATE_VARIABLE_PREFIX:
            // TODO
            break;
    }
};

let getMetaType = (data) => {
    if (isString(data)) return STRING;

    else if (isNumber(data)) return NUMBER;

    else if (isBool(data)) return BOOLEAN;

    else if (isNull(data)) return NULL;

    else if (isObject(data)) return JSON_TYPE;
};

module.exports = getLambdaUiValue;
