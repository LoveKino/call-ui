'use strict';

let LambdaUI = require('../..');

/**
 * 1. no expand
 *
 * 2. can not change expression type
 *
 * 3. custom input
 *
 * 4. custome expression ui
 */

document.body.appendChild(LambdaUI({
    predicates: {
        login: 1
    },

    predicatesMetaInfo: {
        login: {
            args: [{
                name: 'username',
                defaultValue: {
                    path: 'data.string',
                    value: '',
                    placeholder: 'username, eg: ddchen'
                }
            }, {
                name: 'password',
                defaultValue: {
                    path: 'data.string',
                    type: 'password',
                    value: ''
                }
            }]
        }
    },

    value: {
        path: 'predicate.login'
    },

    expressAbility: () => null
}));
