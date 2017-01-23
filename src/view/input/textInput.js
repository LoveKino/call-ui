'use strict';

let {
    view, n
} = require('kabanery');

module.exports = view((data) => {
    let {
        type,
        placeholder,
        content,
        onchange
    } = data;

    return n(`input type="${type || 'text'}" placeholder="${placeholder || ''}"`, {
        style: {
            marginTop: -10
        },

        value: content,

        oninput: (e) => {
            data.content = e.target.value;
            onchange && onchange(e.target.value);
        }
    });
});
