'use strict';

let {
    PREDICATE
} = require('../../src/const');

let PassPredicateUI = ({
    getSuffixParams
}) => {
    return getSuffixParams(0);
};

PassPredicateUI.detect = ({
    expressionType
}) => {
    return expressionType === PREDICATE;
};

module.exports = PassPredicateUI;
