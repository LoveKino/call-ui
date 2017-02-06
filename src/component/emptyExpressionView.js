'use strict';

let expandorWrapper = require('./expandorWrapper');

module.exports = ({
    optionsView,
    expandor
}) => {
    return expandorWrapper(optionsView, expandor);
};
