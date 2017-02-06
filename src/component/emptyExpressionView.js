'use strict';

let expandorWrapper = require('./expandorWrapper');

module.exports = ({
    getOptionsView,
    getExpandor
}) => {
    return expandorWrapper(getOptionsView(), getExpandor());
};
