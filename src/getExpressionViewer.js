'use strict';

let EmptyExpressionView = require('./layout/emptyExpressionView');

let JsonDataView = require('./layout/jsonDataView');

let AbstractionView = require('./layout/abstractionView');

let PredicateView = require('./layout/predicateView');

let VariableView = require('./layout/variableView');

let {
    getExpressionType,
    getPredicatePath,
    getPredicateMetaInfo
} = require('./model');

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = require('./const');

/**
 * choose the viewer to render expression
 *
 * @param viewer
 *  pre-defined render function
 *  TODO add test function for viewer as graceful degradation
 */
module.exports = ({
    value, viewer, predicatesMetaInfo
}, options) => {
    // exists pre-defined viewer
    if (viewer) {
        if (!viewer.detect) {
            return viewer;
        } else {
            // detect
            if (viewer.detect(options)) {
                return viewer;
            }
        }
    }

    let expressionType = getExpressionType(value.path);

    if (expressionType === PREDICATE) {
        // find pre-defined predicate function level viewer
        let metaInfo = getPredicateMetaInfo(predicatesMetaInfo, getPredicatePath(value.path));
        if (metaInfo.viewer) {
            return (expOptions) => metaInfo.viewer(expOptions, metaInfo);
        }
    }

    // choose the default expresion viewer
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
