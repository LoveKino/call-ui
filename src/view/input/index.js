'use strict';

let boolInput = require('./boolInput');

let numberInput = require('./numberInput');

let textInput = require('./textInput');

let jsonCodeInput = require('./jsonCodeInput');

let nullInput = require('./nullInput');

let {
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL
} = require('../../const');

let inputViewMap = {
    [NUMBER]: numberInput,
    [STRING]: textInput,
    [BOOLEAN]: boolInput,
    [JSON_TYPE]: jsonCodeInput,
    [NULL]: nullInput
};

module.exports = (data, type) => {
    let v = inputViewMap[type];

    return v && v(data);
};
