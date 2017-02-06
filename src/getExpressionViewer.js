'use strict';

let EmptyExpressionView = require('./component/emptyExpressionView');

let JsonDataView = require('./component/jsonDataView');

let AbstractionView = require('./component/abstractionView');

let PredicateView = require('./component/predicateView');

let VariableView = require('./component/variableView');

let {
    getExpressionType
} = require('./model');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = require('./const');

/**
 * choose the viewer to render expression
 */
module.exports = ({
    value
}) => {
    let expressionType = getExpressionType(value.path);

    switch (expressionType) {
        case PREDICATE:
            return PredicateView;
        case JSON_DATA:
            return JsonDataView;
        case VARIABLE:
            return VariableView;
        case ABSTRACTION:
            return AbstractionView;
        default:
            return EmptyExpressionView;
    }
};
