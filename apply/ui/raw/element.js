'use strict';

let {
    JSON_DATA
} = require('../../src/const');

let {
    parseArgs, n
} = require('kabanery');

/**
 * raw element used as a data container
 */

let raw = (...args) => {
    // get tagName to decide value and onchange
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    tagName = tagName.toLowerCase();

    let rawElement = ({
        value,
        onchange
    }) => {
        let onValueChanged = (v) => {
            value.value = v;
            onchange(value);
        };

        if (tagName === 'input' || tagName === 'textarea') {
            attributes.value = value.value;

            attributes.oninput = attributes.oninput || (e) => {
                onValueChanged(e.target.value);
            };
        } else if (tagName === 'select') {
            attributes.onchange = attributes.onchange || (e) => {
                onValueChanged(e.target.value);
            }
        }

        return n(tagName, attributes, childs);
    };

    let rawElement.detect = ({
        expresionType
    }) => expresionType === JSON_DATA;

    return rawElement;
};

module.exports = rawElement;
