'use strict';

let LetaUIView = require('./letaUI');

let {
    runner, getLambdaUiValue
} = require('./model');

let {
    dsl
} = require('leta');

let {
    mergeMap
} = require('bolzano');

let meta = require('./tool/meta');

let {
    getJson, method, v, r
} = dsl;

module.exports = {
    method,
    v,
    r,
    meta,
    runner,

    LetaUI: (...args) => {
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

        return LetaUIView(mergeMap(data, {
            onchange: (v) => {
                data.onchange && data.onchange(v, {
                    runLeta
                });
            },

            runLeta
        }));
    }
};
