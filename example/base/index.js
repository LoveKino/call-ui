'use strict';

let LambdaRetView = require('./lambdaRet');

let {
    map
} = require('bolzano');

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
