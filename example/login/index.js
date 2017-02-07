'use strict';

let {
    LetaUI, meta
} = require('../..');

let {
    dsl
} = require('leta');

let {
    method
} = dsl;

let {
    n
} = require('kabanery');

let Button = require('../../apply/ui/button');

let simpleForm = require('../../apply/ui/simpleForm');

/**
 * 1. no expand
 *
 * 2. can not change expression type
 *
 * 3. custom input
 *
 * 4. custome expression ui
 */

let simpleInput = require('../../apply/ui/simpleInput');

let login = method('login');

let captchaInput = ({
    onchange
}) => {
    return n('div', [
        n('input', {
            oninput: (e) => {
                onchange({
                    path: 'data.string',
                    value: e.target.value
                });
            }
        }),

        n('img src="https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"', {
            style: {
                width: 40
            }
        })
    ]);
};

/**
 * scope:
 *      - runtime scope (in leta expression)
 *
 *      - predicate scope
 *
 *      - global scope
 *
 * TODO expression viewer configuration in predicatesMetaInfo
 */
document.body.appendChild(
    LetaUI(
        login('', '', '', 0),

        {
            predicates: {
                // TODO can update view of param, reflect logic to view by update some data
                // TODO move predicate meta info here as comment for a function
                login: meta((username, password, captcha, doSubmit) => {
                    console.log(username, password, captcha, doSubmit); // eslint-disable-line
                }, {
                    // TODO auto generate title or name by analysis function definition
                    viewer: simpleForm,
                    args: [{
                        viewer: simpleInput,
                        title: 'username',
                        placeholder: 'input your username'
                    }, {
                        viewer: simpleInput,
                        title: 'password',
                        placeholder: 'input your password',
                        inputType: 'password'
                    }, {
                        viewer: captchaInput
                    }, {
                        viewer: Button,
                        title: 'submit'
                    }]
                })
            },

            onchange: (v, {
                runLeta
            }) => {
                runLeta(v);
            }
        }
    )
);
