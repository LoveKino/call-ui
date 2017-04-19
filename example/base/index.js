'use strict';

let LambdaRetView = require('./lambdaRet');

let {
    map
} = require('bolzano');

let {
    n, mount
} = require('kabanery');

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
mount(LambdaRetView({
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
}), document.body);

mount(n('br'), document.body);

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
mount(LambdaRetView({
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
}), document.body);

mount(n('br'), document.body);

mount(LambdaRetView({
    predicates: {
        math: {
            'zero': () => 0
        }
    },

    predicatesMetaInfo: {
        math: {}
    }
}), document.body);
