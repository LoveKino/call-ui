'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view((data) => {
    let {
        value,
        optionsView,
        getSuffixParams,
        getPrefixParams
    } = data;

    value.params = value.params || [];
    value.infix = value.infix || 0;

    return n('div', [
        getPrefixParams(),

        optionsView,

        n('div', {
            style: {
                padding: 5,
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            getSuffixParams()
        ])
    ]);
});
