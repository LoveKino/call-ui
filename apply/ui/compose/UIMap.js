'use strict';

let {
    JSON_DATA
} = require('../../../src/const');

let {
    map, mergeMap
} = require('bolzano');

let UIMap = (handler) => {
    let UI = (expOptions) => {
        return map(map(expOptions.value.value, (item, index) => {
            return mergeMap(expOptions, {
                value: {
                    value: expOptions.value.value[index]
                },
                onchange: (v) => {
                    expOptions.value.value[index] = v.value;
                    expOptions.onchange && expOptions.onchange(expOptions.value);
                }
            });
        }), handler);
    };

    UI.detect = ({
        expressionType
    }) => {
        return expressionType === JSON_DATA;
    };

    return UI;
};

module.exports = UIMap;
