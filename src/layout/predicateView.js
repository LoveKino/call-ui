'use strict';

let {
    n, view
} = require('kabanery');

let {
    map
} = require('bolzano');

let expandorWrapper = require('../component/expandorWrapper');

module.exports = view(({
    value,
    getOptionsView,
    getExpandor,
    getPrefixParams,
    getSuffixParams
}) => {
    return expandorWrapper(n('div', [
        arrangeItems(getPrefixParams(value.infix)),

        getOptionsView(),

        n('div', {
            style: {
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            arrangeItems(getSuffixParams(value.infix))
        ])
    ]), getExpandor());
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
