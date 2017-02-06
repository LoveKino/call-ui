'use strict';

let letaUI = require('../..');

let {
    dsl
} = require('leta');

let {
    method
} = dsl;

/**
 * 1. no expand
 *
 * 2. can not change expression type
 *
 * 3. custom input
 *
 * 4. custome expression ui
 */

let inputLogin = method('inputLogin');
let inputCaptcha = method('inputCaptcha');

document.body.appendChild(letaUI(inputLogin('', '', inputCaptcha('img')), {
    predicates: {
        inputLogin: () => {},
        inputCaptcha: () => {}
    },

    predicatesMetaInfo: {
        inputLogin: {
            title: 'login',

            args: [{
                name: 'username',
                content: {
                    placeholder: 'username, eg: ddchen'
                }
            }, {
                name: 'password',
                content: {
                    placeholder: 'password, eg: 123',
                    type: 'password'
                }
            }, {
                name: 'inputCaptcha'
            }]
        },

        inputCaptcha: {
            args: [{
                name: 'img',
                content: {
                }
            }]
        }
    },

    expressAbility: () => null
}));
