'use strict';

let {
    JSON_DATA
} = require('../../src/const');

let Select = require('kabanery-select');

/**
 * simple select ui for leta-ui
 */
let simpleSelect = ({
    value,
    onchange
}, {
    options
}) => {
    return Select({
        selected: value.value,
        onchange: (one) => {
            value.value = one;
            onchange(value);
        },
        options
    });
};

simpleSelect.detect = ({
    expresionType
}) => expresionType === JSON_DATA;

module.exports = simpleSelect;
