'use strict';

let Expandor = require('../view/expandor');

let {
    getPredicateMetaInfo,
    getPredicatePath,
    infixTypes
} = require('../model');

let {
    get
} = require('bolzano');

module.exports = ({
    data,
    onExpand,
    onselected
}) => {
    let {
        predicates, expandAbility
    } = data;

    let options = expandAbility ? expandAbility(data) : infixTypes({
        predicates
    });

    return Expandor({
        hide: data.hideExpressionExpandor,

        options,

        onExpand: (hide) => {
            data.hideExpressionExpandor = hide;
            data.infixPath = null;
            onExpand && onExpand();
        },

        onselected: (v, path) => {
            data.infixPath = path;
            data.title = get(getPredicateMetaInfo(data.predicatesMetaInfo, getPredicatePath(path)), 'args.0.name');
            data.hideExpressionExpandor = true;
            onselected && onselected(v, path);
        }
    });
};

