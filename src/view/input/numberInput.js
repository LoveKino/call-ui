'use strict';

let {
    view, n
} = require('kabanery');

module.exports = view((data) => {
    let {
        content,
        placeholder,
        onchange
    } = data;

    return n(`input type="number" placeholder="${placeholder||''}"`, {
        style: {
            marginTop: -10
        },
        value: content,
        oninput: (e) => {
            let num = Number(e.target.value);
            data.content = num;
            onchange && onchange(num);
        }
    });
});
