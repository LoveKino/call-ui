'use strict';

let LambdaUI = require('../..');

let {
    dsl, interpreter
} = require('leta');

let {
    getJson
} = dsl;

let {
    map
} = require('bolzano');

let {
    n, view
} = require('kabanery');

let demo = view(() => {
    let predicates = {
        math: {
            '+': (x, y) => x + y
        },

        map
    };

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
        LambdaUI({
            predicatesMetaInfo: {
                math: {
                    '+': {
                        args: [{
                            type: 'number',
                            name: 'number'
                        }, {
                            type: 'number',
                            name: 'number'
                        }]
                    }
                },

                map: {
                    args: [{
                        type: 'Array',
                        name: 'list'
                    }, {
                        type: 'function',
                        name: 'handler'
                    }]
                }
            },

            predicates,

            onchange: (v) => {
                let getValue = (v) => {
                    if (v instanceof Error) {
                        return v;
                    }
                    try {
                        return run(getJson(v)).toString();
                    } catch (err) {
                        return err;
                    }
                };

                v = getValue(v);
                updateShowView('value', v && v instanceof Error ? n('pre', v.stack) : n('span', v));
            }
        }),

        valueShowView({
            value: n('span', '')
        })
    ]);
});

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
document.body.appendChild(demo({}));
