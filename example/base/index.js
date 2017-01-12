'use strict';

let LambdaUI = require('../..');

/**
 * type system
 *   basic type: number, string, boolean, function, object, array
 */
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
    }
}));
