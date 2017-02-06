'use strict';

let assert = require('assert');

let LetaUI = require('../..');

let {
    n
} = require('kabanery');

let {
    dsl
} = require('leta');

let {
    method, r, v
} = dsl;

let test = (name, data, assertFun) => {
    let changed = false;

    data.onchange = (v, {
        runLeta
    }) => {
        if (!changed) {
            changed = true;
            assertFun(runLeta(v));
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
        LetaUI(data),
        n('pre', {
            style: {
                fontSize: 10
            }
        }, assertFun.toString())
    ]));
};

let testWithLeta = (name, lambda, data, assertFun) => {
    data = data || {};
    let changed = false;

    data.onchange = (v, {
        runLeta
    }) => {
        if (!changed) {
            changed = true;
            assertFun(runLeta(v));
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
        LetaUI(lambda, data),
        n('pre', {
            style: {
                fontSize: 10
            }
        }, assertFun.toString())
    ]));
};

testWithLeta('number', 10, null, (v) => assert.equal(v, 10));

testWithLeta('bool: true', true, null, (v) => assert.equal(v, true));

testWithLeta('string', '12345', null, (v) => assert.equal(v, '12345'));

testWithLeta('null', null, null, (v) => assert.equal(v, null));

testWithLeta('json', {
    a: 1,
    b: 2
}, null, (v) => assert.deepEqual(v, {
    a: 1,
    b: 2
}));

testWithLeta('predicate:+', method('math.+')(1, 2), {
    predicates: {
        math: {
            '+': (x, y) => x + y
        }
    }
}, (v) => assert.equal(v, 3));

testWithLeta('abstraction:', r('x', 'y', method('math.+')(v('x'), v('y'))), {
    predicates: {
        math: {
            '+': (x, y) => x + y
        }
    }
}, (v) => assert.equal(v(3, 4), 7));

testWithLeta('predicate: deep', method('math.+')(method('math.+')(1, 3), 2), {
    predicates: {
        math: {
            '+': (x, y) => x + y
        }
    }
}, (v) => assert.equal(v, 6));

// TODO infix information
// TODO support infix expression in leta
testWithLeta('infix', method('math.+')(2, 5), {
    predicates: {
        math: {
            '+': (x, y) => x + y
        }
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
