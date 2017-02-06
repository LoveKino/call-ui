'use strict';

let expandorWrapper = require('../component/expandorWrapper');

module.exports = ({
    getOptionsView,
    getExpandor
}) => {
    return expandorWrapper(getOptionsView(), getExpandor());
};
