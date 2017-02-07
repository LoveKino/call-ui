'use strict';

let {
    n
} = require('kabanery');

let {
    JSON_DATA
} = require('../../src/const');

module.exports = ({
    expressionType,
    onchange
}, {
    title, style = {}
}) => {
    if (expressionType !== JSON_DATA) {
        return;
    }

    return n('button', {
        style,

        onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();

            onchange({
                path: 'data.number',
                value: 1
            });

            onchange({
                path: 'data.number',
                value: 0
            });
        }
    }, title);
};
