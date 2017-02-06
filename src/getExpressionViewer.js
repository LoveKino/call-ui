'use strict';

let EmptyExpressionView = require('./layout/emptyExpressionView');

let JsonDataView = require('./layout/jsonDataView');

let AbstractionView = require('./layout/abstractionView');

let PredicateView = require('./layout/predicateView');

let VariableView = require('./layout/variableView');

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
    value, viewer
}) => {
    if(viewer) return viewer;
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
