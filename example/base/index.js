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
                    name: 'number',
                    defaultValue: {
                        path: 'data.number',
                        value: 0
                    }
                }, {
                    name: 'number',
                    defaultValue: {
                        path: 'data.number',
                        value: 0
                    }
                }]
            }
        },

        map: {
            args: [{
                name: 'list'
            }, {
                name: 'handler'
            }]
        }
    }
}));

document.body.appendChild(n('br'));

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
                    name: 'number',
                    defaultValue: {
                        path: 'data.number',
                        value: 0
                    }
                }, {
                    name: 'number',
                    defaultValue: {
                        path: 'data.number',
                        value: 0
                    }
                }]
            }
        },

        map: {
            args: [{
                name: 'list'
            }, {
                type: 'function',
                name: 'handler'
            }]
        }
    },

    expressAbility: () => {
        return {
            predicate: {
                math: {
                    '+': (x, y) => x + y
                }
            }
        };
    },

    expandAbility: () => {
        return {
            predicate: {
                map
            }
        };
    },

    showSelectTree: true
}));
