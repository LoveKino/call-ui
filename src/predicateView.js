'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view((data) => {
    let {
        value,
        optionsView,
        getSuffixParams,
        getPrefixParams,
        onchange = id
    } = data;

    value.params = value.params || [];
    value.infix = value.infix || 0;

    onchange(value);

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

const id = v => v;
