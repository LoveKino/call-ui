'use strict';

let {
    view
} = require('kabanery');

let SelectView = require('kabanery-select');

module.exports = view((data) => {
    let {
        content,
        onchange
    } = data;

    return SelectView({
        options: [
            ['true'],
            ['false']
        ],
        selected: content === true ? 'true' : 'false',
        onchange: (v) => {
            let ret = false;
            if (v === 'true') {
                ret = true;
            }
            data.content = ret;
            onchange && onchange(v);
        }
    });
});
