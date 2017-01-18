'use strict';

let {
    n, view
} = require('kabanery');

module.exports = view(({
    optionsView
}) => {
    return () => n('div', [optionsView]);
});
