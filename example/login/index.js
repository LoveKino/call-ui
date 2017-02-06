'use strict';

let letaUI = require('../..');

let {
    dsl
} = require('leta');

let {
    method
} = dsl;

let {
    n
} = require('kabanery');

let {
    map
} = require('bolzano');

/**
 * 1. no expand
 *
 * 2. can not change expression type
 *
 * 3. custom input
 *
 * 4. custome expression ui
 */

let simpleInput = ({
    title,
    placeholder,
    type = 'text'
}) => ({
    onchange
}) => {
    return n('fieldset', {
        style: {
            border: 0
        }
    }, [
        n('label', {
            style: {
                marginRight: 8
            }
        }, title),

        n(`input type="${type}" placeholder="${placeholder}"`, {
            oninput: (e) => {
                onchange({
                    path: 'data.string',
                    value: e.target.value
                });
            }
        })
    ]);
};

let button = ({
    text
}) => ({
    onchange
}) => {
    return n('button', {
        onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();

            onchange({
                path: 'data.number',
                value: 1
            });

            onchange({
                path: 'data.number',
                value: 0
            });
        }
    }, text);
};

let login = method('login');
let UserNameInput = method('UI.userNameInput');
let PasswordInput = method('UI.passwordInput');
let Form = method('UI.form');
let Submit = method('UI.submit');
let CaptchaInput = method('UI.captchaInput');

document.body.appendChild(
    letaUI(
        Form(
            login(
                UserNameInput(''),
                PasswordInput(''),
                CaptchaInput(''),
                Submit(0))
        ),

        {
            predicates: {
                // TODO can update view of param
                // reflect logic to view by update some data
                login: (username, password, captcha, doSubmit) => {
                    console.log(username, password, captcha, doSubmit); // eslint-disable-line
                    // TODO
                }
            },

            UI: {
                userNameInput: simpleInput({
                    title: 'username',
                    placeholder: 'input your username'
                }),

                passwordInput: simpleInput({
                    title: 'password',
                    placeholder: 'input your password',
                    type: 'password'
                }),

                captchaInput: ({
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
                },

                form: ({
                    getSuffixParams
                }) => {
                    return n('form class="expression-wrapper"', [
                        n('div', 'login'),
                        map(getSuffixParams(0), (item) => {
                            return n('div', {
                                style: {
                                    padding: 8
                                }
                            }, item);
                        })
                    ]);
                },

                submit: button({
                    text: 'submit'
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
