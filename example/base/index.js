'use strict';

let LambdaRetView = require('./lambdaRet');

let {
    map
} = require('bolzano');

let {
    n
} = require('kabanery');

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
document.body.appendChild(LambdaRetView({
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
    }
}));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'number',
        value: 10,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'boolean',
        value: true,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'boolean',
        value: false,
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'string',
        value: '12345',
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        type: 'null',
        path: 'data'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
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

document.body.appendChild(LambdaRetView({
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

document.body.appendChild(LambdaRetView({
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
