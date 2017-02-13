'use strict';

let {
    RealLetaUI, meta
} = require('../..');

let {
    dsl
} = require('leta');

let {
    method
} = dsl;

let {
    overArgs
} = require('bolzano');

let {
    n
} = require('kabanery');

let button = require('../../apply/ui/button');

let simpleForm = require('../../apply/ui/simpleForm');

let simpleFolder = require('../../apply/ui/simpleFolder');

let simpleList = require('../../apply/ui/simpleList');

let simpleSelect = require('../../apply/ui/simpleSelect');

let UIMap = require('../../apply/ui/compose/UIMap');

let {
    N
} = require('kabanery');

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
    RealLetaUI(
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
                        viewer: ({
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
                        }
                    }, {
                        viewer: button,
                        title: 'submit'
                    }]
                })
            }
        }
    )
);

document.body.appendChild(n('br'));

let createProject = method('createProject');
let advanceOpts = method('advanceOpts');

document.body.appendChild(
    RealLetaUI(
        // TODO conditional
        // example, for web project using createWebProject,
        // for android project using createAndroidProject
        createProject('', 'web', '', advanceOpts([], [], ''), [0, 0]),

        {
            predicates: {
                createProject: meta(
                    (projectName, projectType, startUrl, advanceOpts, [doSubmit, doCancel]) => {
                        console.log(projectName, projectType, startUrl, advanceOpts, doSubmit, doCancel); // eslint-disable-line
                    },

                    {
                        viewer: simpleForm,
                        args: [

                            {
                                viewer: simpleInput,
                                placeholder: 'input your project name'
                            },

                            {
                                viewer: simpleSelect,
                                options: [['android'], ['web']]
                            },

                            {
                                viewer: simpleInput,
                                placeholder: 'input your start url'
                            },

                            null,

                            {
                                viewer: UIMap(overArgs(N('div', {
                                    style: {
                                        display: 'inline-block',
                                        paddingRight: 10
                                    }
                                }, button), (expOptions, index) => {
                                    return [expOptions, {
                                        title: index === 0 ? 'submit' : 'cancel'
                                    }];
                                }))
                            }
                        ]
                    }
                ),

                advanceOpts: meta((cookies, headers, agent) => {
                    return {
                        cookies,
                        headers,
                        agent
                    };
                }, {
                    viewer: simpleFolder,
                    title: 'advance options',
                    hide: true,
                    args: [{
                        viewer: simpleList,
                        title: 'cookie',
                        itemOptions: {
                            placeholder: 'a=b;path=/;',
                        }
                    }, {
                        viewer: simpleList,
                        title: 'header',
                        type: 'text',
                        itemOptions: {
                            placeholder: 'Pagram: no-cache',
                        }
                    }, {
                        viewer: simpleInput,
                        title: 'agent'
                    }]
                })
            }
        }
    )
);
