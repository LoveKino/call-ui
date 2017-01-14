'use strict';

// expression type
const EXPRESSION_TYPES = ['variable', 'data', 'abstraction', 'predicate'];

const [VARIABLE, JSON_DATA, ABSTRACTION, PREDICATE] = EXPRESSION_TYPES;

const DATA_TYPES = ['number', 'boolean', 'string', 'json', 'null'];

const [NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL] = DATA_TYPES;

const INLINE_TYPES = [NUMBER, BOOLEAN, STRING, NULL];

const DEFAULT_DATA_MAP = {
    [NUMBER]: 0,
    [BOOLEAN]: true,
    [STRING]: '',
    [JSON_TYPE]: '{\n\n}',
    [NULL]: null
};

module.exports = {
    EXPRESSION_TYPES,
    VARIABLE,
    JSON_DATA,
    ABSTRACTION,
    PREDICATE,

    DATA_TYPES,
    NUMBER,
    BOOLEAN,
    STRING,
    JSON_TYPE,
    NULL,
    INLINE_TYPES,

    DEFAULT_DATA_MAP
};
