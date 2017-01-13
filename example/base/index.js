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

let demo = view(() => {
    let value = null;

    let predicates = {
        math: {
            '+': (x, y) => x + y
        }
    };

    let run = interpreter(predicates);

    let updateShowView = null;

    let valueShowView = view(({
        value
    }, {
        update
    }) => {
        updateShowView = update;
        return value && value instanceof Error ? n('pre', value.stack) : n('span', run(getJson(value)));
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
                }
            },

            predicates,

            onchange: (v) => {
                updateShowView('value', v);
            }
        }),

        valueShowView({
            value
        })
    ]);
});

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
document.body.appendChild(demo({}));
