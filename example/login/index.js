'use strict';

let LambdaUI = require('../..');

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
    }
}));
