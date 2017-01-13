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

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'number',
        value: 10,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'boolean',
        value: true,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'boolean',
        value: false,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'string',
        value: '12345',
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'null',
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'json',
        value: {
            a: 1,
            b: 2
        },
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {
        math: {
            '+': (x, y) => x + y
        }
    },
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

    value: {
        path: 'predicate.math.+',
        params: [{
            path: 'data',
            type: 'number',
            value: 1
        }, {
            path: 'data',
            type: 'number',
            value: 2
        }]
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaUI({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        path: 'abstraction',
        variables: ['x', 'y'],
        expression: {
            path: 'data',
            type: 'number',
            value: 10
        }
    }
}));
