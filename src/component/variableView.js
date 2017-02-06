'use strict';

let {
    n, view
} = require('kabanery');

let expandorWrapper = require('./expandorWrapper');

module.exports = view(({
    optionsView, expandor
}) => {
    return () => expandorWrapper(n('div', [optionsView]), expandor);
});
