'use strict';

let {
    n
} = require('kabanery');

let {
    JSON_DATA
} = require('../../src/const');

let {
    getDataTypePath
} = require('../../src/model');

let InputView = require('../../src/view/input');

module.exports = ({
    value,
    onchange,
    expressionType
}, {
    title,
    placeholder,
    inputType = 'text'
}) => {
    if (expressionType !== JSON_DATA) {
        return;
    }

    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    return n('fieldset', [
        n('label', [title]),

        InputView({
            content: value.value,
            type: inputType,
            placeholder: placeholder,
            onchange: onValueChanged
        }, getDataTypePath(value.path))
    ]);
};
