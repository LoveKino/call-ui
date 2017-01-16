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
        value: 10,
        path: 'data.number'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: true,
        path: 'data.boolean'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: false,
        path: 'data.boolean'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: '12345',
        path: 'data.string'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        path: 'data.null'
    }
}));

document.body.appendChild(n('p'));

document.body.appendChild(LambdaRetView({
    predicates: {},
    predicatesMetaInfo: {},
    value: {
        value: {
            a: 1,
            b: 2
        },
        path: 'data.json'
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
            path: 'data.number',
            value: 1
        }, {
            path: 'data.number',
            value: 2
        }]
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
}));
