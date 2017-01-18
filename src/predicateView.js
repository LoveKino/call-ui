'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view(({
    value,
    optionsView,
    getSuffixParams,
    getPrefixParams
}) => {
    value.params = value.params || [];
    value.infix = value.infix || 0;

    return n('div', [
        getPrefixParams(),

        optionsView,

        value.params.slice(value.infix).length && n('div', {
            style: {
                padding: 5,
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            getSuffixParams()
        ])
    ]);
});
