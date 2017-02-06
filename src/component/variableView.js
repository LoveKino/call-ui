'use strict';

let {
    n, view
} = require('kabanery');

let expandorWrapper = require('./expandorWrapper');

module.exports = view(({
    optionsView, getExpandor
}) => {
    return () => expandorWrapper(n('div', [optionsView]), getExpandor());
});
