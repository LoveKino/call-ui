'use strict';

let assert = require('assert');

let LambdaUI = require('../..');

let {
    getLambda
} = require('../../src/model');

let {
    dsl, interpreter
} = require('leta');

let {
    getJson
} = dsl;

let {
    n
} = require('kabanery');

let {
    map
} = require('bolzano');

let test = (name, data, assertFun) => {
    let run = interpreter(data.predicates);

    let changed = false;

    data.onchange = (v) => {
        v = getLambda(v);

        let getValue = (v) => {
            if (v instanceof Error) {
                return v;
            }
            try {
                return run(getJson(v));
            } catch (err) {
                return err;
            }
        };

        if (!changed) {
            changed = true;
            v = getValue(v);

            assertFun(v);
        }
    };

    setTimeout(() => {
        if (!changed) {
            throw new Error('expect onchange event');
        }
    }, 500);

    document.body.appendChild(n('div', {
        style: {
            marginBottom: 50
        }
    }, [
        n('label', {
            style: {
                fontSize: 14
            }
        }, name),
        LambdaUI(data),
        n('pre', {
            style: {
                fontSize: 10
            }
        }, assertFun.toString())
    ]));
};

test('number', {
    predicates: {
        math: {
            '+': (x, y) => x + y
        },

        map
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

    value: {
        value: 10,
        path: 'data.number'
    }
}, (v) => assert.equal(v, 10));

test('bool: true', {
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: true,
        path: 'data.boolean'
    }
}, (v) => assert.equal(v, true));

test('bool: false', {
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: false,
        path: 'data.boolean'
    }
}, (v) => assert.equal(v, false));

test('string', {
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: '12345',
        path: 'data.string'
    }
}, (v) => assert.equal(v, '12345'));

test('null', {
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        path: 'data.null'
    }
}, (v) => assert.equal(v, null));

test('json', {
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: {
            a: 1,
            b: 2
        },
        path: 'data.json'
    }
}, (v) => assert.deepEqual(v, {
    a: 1,
    b: 2
}));

test('predicate:+', {
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
            path: 'data.number',
            value: 1
        }, {
            path: 'data.number',
            value: 2
        }]
    }
}, (v) => assert.equal(v, 3));

test('abstraction:', {
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
        path: 'abstraction',
        variables: ['x', 'y'],
        expression: {
            path: 'predicate.math.+',
            params: [{
                path: 'variable.x'
            }, {
                path: 'variable.y'
            }]
        }
    }
}, (v) => assert.equal(v(3, 4), 7));

test('predicate: deep', {
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
            path: 'predicate.math.+',
            params: [{
                path: 'data.number',
                value: 1
            }, {
                path: 'data.number',
                value: 3
            }]
        }, {
            path: 'data.number',
            value: 2
        }]
    }
}, (v) => assert.equal(v, 6));

test('infix', {
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
            path: 'data.number',
            value: 2

        }, {
            path: 'data.number',
            value: 5
        }],
        infix: 1
    }
}, (v) => assert.equal(v, 7));

test('infix:deep', {
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
            path: 'data.number',
            value: 2

        }, {
            path: 'predicate.math.+',
            params: [{
                path: 'data.number',
                value: 2

            }, {
                path: 'data.number',
                value: 5
            }],
            infix: 1
        }],
        infix: 1
    }
}, (v) => assert.equal(v, 9));

test('infix: one params', {
    predicates: {
        math: {
            'succ': (x) => x + 1
        }
    },

    predicatesMetaInfo: {
        math: {
            'succ': {
                args: [{
                    type: 'number',
                    name: 'source'
                }]
            }
        }
    },

    value: {
        path: 'predicate.math.succ',
        params: [{
            path: 'data.number',
            value: 2

        }],
        infix: 1
    },

    nameMap: {
        'abstraction': 'define function'
    },

    pathMapping: (parts) => {
        return parts.join('.');
    }
}, (v) => assert.equal(v, 3));
