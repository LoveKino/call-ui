'use strict';

let {
    RealLetaUI, meta, method
} = require('../..');

let {
    view
} = require('kabanery');

let simpleForm = require('../../apply/ui/simpleForm');

let simpleInput = require('../../apply/ui/simpleInput');

let simpleSelect = require('../../apply/ui/simpleSelect');

let ProjectView = view((data, {
    update
}) => {
    let setProject = method('setProject');
    let setAndroidProjectOptions = method('setAndroidProjectOptions');
    let setWebProjectOptions = method('setWebProjectOptions');

    return RealLetaUI(
        // initial state
        setProject(
            '',
            data.projectType,
            data.projectType === 'web' ? setWebProjectOptions('') : setAndroidProjectOptions('')
        ),

        {
            predicates: {
                setProject: meta((name, type, optionObj) => {
                    console.log(name, type, optionObj); // eslint-disable-line
                    if (type !== data.projectType) {
                        update('projectType', type);
                    }
                }, {
                    viewer: simpleForm,
                    args: [{
                        viewer: simpleInput,
                        title: 'name'
                    }, {
                        viewer: simpleSelect,
                        options: [
                            ['web'],
                            ['android']
                        ]
                    }]
                }),

                setWebProjectOptions: meta((url) => {
                    return {
                        url
                    };
                }, {
                    viewer: simpleForm,
                    args: [{
                        viewer: simpleInput,
                        title: 'url'
                    }]
                }),

                setAndroidProjectOptions: meta((packageName) => {
                    return {
                        packageName
                    };
                }, {
                    viewer: simpleForm,
                    args: [{
                        viewer: simpleInput,
                        title: 'packageName'
                    }]
                })
            }
        });
});

document.body.appendChild(ProjectView({
    projectType: 'web'
}));
