'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view(({
    value,
    optionsView,
    prefixParams,
    suffixParams
}) => {
    return n('div', [
        prefixParams,

        optionsView,

        n('div', {
            style: {
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            suffixParams
        ])
    ]);
});
