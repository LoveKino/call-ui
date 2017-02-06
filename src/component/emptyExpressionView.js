'use strict';

let expandorWrapper = require('./expandorWrapper');

module.exports = ({
    optionsView,
    getExpandor
}) => {
    return expandorWrapper(optionsView, getExpandor());
};
