'use strict';

let LambdaUI = require('../..');

let {
    dsl, interpreter
} = require('leta');

let {
    getJson
} = dsl;

let {
    n, view
} = require('kabanery');

let {
    getLambda
} = require('../../src/model');

let {
    mergeMap
} = require('bolzano');

module.exports = view((data) => {
    let {
        predicates,
    } = data;

    let run = interpreter(predicates);

    let updateShowView = null;

    let valueShowView = view(({
        value
    }, {
        update
    }) => {
        updateShowView = update;

        return n('div', {
            style: {
                marginTop: 10
            }
        }, [value]);
    });

    return () => n('div', [
        valueShowView({
            value: n('span', '')
        }),

        LambdaUI(mergeMap(data, {
            onchange: (v) => {
                v = getLambda(v);

                let getValue = (v) => {
                    if (v instanceof Error) {
                        return v;
                    }
                    try {
                        v = run(getJson(v));
                        if (v === null || v === undefined) return 'null';
                        return v.toString();
                    } catch (err) {
                        return err;
                    }
                };

                v = getValue(v);

                updateShowView('value', v && v instanceof Error ? n('pre', v.stack) : n('span', v));
            }
        }))
    ]);
});
