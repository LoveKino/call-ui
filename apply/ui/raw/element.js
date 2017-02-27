'use strict';

let {
    JSON_DATA
} = require('../../../src/const');

let {
    parseArgs, n
} = require('kabanery');

let {
    mergeMap
} = require('bolzano');

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
        let attrs = mergeMap(attributes, {});

        let onValueChanged = (e) => {
            value.value = e.target.value;
            onchange(value);
        };

        if (tagName === 'input' || tagName === 'textarea') {
            attrs.value = value.value;

            attrs.oninput = attrs.oninput || onValueChanged;
        } else if (tagName === 'select') {
            attrs.onchange = attrs.onchange || onValueChanged;
        }

        return n(tagName, attrs, childs);
    };

    rawElement.detect = ({
        expresionType
    }) => expresionType === JSON_DATA;

    return rawElement;
};

module.exports = raw;
