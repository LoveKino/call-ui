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

        n('div', {
            style: {
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            getSuffixParams()
        ])
    ]);
});
