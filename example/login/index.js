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

let login = method('login');
let captcha = method('captcha');

document.body.appendChild(letaUI(login('', '', captcha('img')), {
    predicates: {
        login: () => {},
        captcha: () => {}
    },

    predicatesMetaInfo: {
        login: {
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
                name: 'captcha'
            }]
        },

        captcha: {
            args: [{
                name: 'img',
                content: {
                }
            }]
        }
    },

    expressAbility: () => null
}));
