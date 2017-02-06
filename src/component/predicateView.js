'use strict';

let {
    n, view
} = require('kabanery');

let {
    map
} = require('bolzano');

let expandorWrapper = require('./expandorWrapper');

module.exports = view(({
    value,
    optionsView,
    expandor,
    getPrefixParams,
    getSuffixParams
}) => {
    return expandorWrapper(n('div', [
        arrangeItems(getPrefixParams(value.infix)),

        optionsView,

        n('div', {
            style: {
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            arrangeItems(getSuffixParams(value.infix))
        ])
    ]), expandor);
});

let arrangeItems = (itemViews) => n('div', {
    'class': 'lambda-params',
    style: {
        display: 'inline-block'
    }
}, [
    map(itemViews, (itemView) => {
        return n('fieldset', {
            style: {
                padding: '4px'
            }
        }, itemView);
    })
]);
