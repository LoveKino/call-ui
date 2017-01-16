'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view(({
    optionsView,
    onchange,
    value
}) => {
    onchange && onchange(value);

    return () => n('div', [optionsView]);
});
