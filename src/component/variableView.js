'use strict';

let {
    n, view
} = require('kabanery');

let expandorWrapper = require('./expandorWrapper');

module.exports = view(({
    getOptionsView, getExpandor
}) => {
    return () => expandorWrapper(n('div', [getOptionsView()]), getExpandor());
});
