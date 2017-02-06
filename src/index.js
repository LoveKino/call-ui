'use strict';

let LetaUI = require('./letaUI');

let {
    runner, getLambdaUiValue
} = require('./model');

let {
    dsl
} = require('leta');

let {
    getJson
} = dsl;

let {
    mergeMap
} = require('bolzano');

module.exports = (...args) => {
    let data = null;
    if (args.length === 1) {
        data = args[0];
    } else if (args.length === 2) {
        data = args[1];
        data.value = getLambdaUiValue(
            getJson(args[0])
        ); // convert lambda json
    } else {
        throw new Error(`unexpected number of arguments. Expect one or two but got ${args.length}`);
    }

    data = data || {};

    let runLeta = runner(data.predicates);

    return LetaUI(mergeMap(data, {
        onchange: (v) => {
            data.onchange && data.onchange(v, {
                runLeta
            });
        },

        runLeta
    }));
};
