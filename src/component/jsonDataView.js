'use strict';

let {
    n, view
} = require('kabanery');

let {
    contain
} = require('bolzano');

let fold = require('kabanery-fold');

let foldArrow = require('kabanery-fold/lib/foldArrow');

let {
    isObject
} = require('basetype');

let boolInput = require('../view/input/boolInput');

let numberInput = require('../view/input/numberInput');

let textInput = require('../view/input/textInput');

let jsonCodeInput = require('../view/input/jsonCodeInput');

let nullInput = require('../view/input/nullInput');

const {
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, INLINE_TYPES, DEFAULT_DATA_MAP
} = require('../const');

let {
    getDataTypePath
} = require('../model');

let inputViewMap = {
    [NUMBER]: numberInput,
    [STRING]: textInput,
    [BOOLEAN]: boolInput,
    [JSON_TYPE]: jsonCodeInput,
    [NULL]: nullInput
};

/**
 * used to define json data
 */
module.exports = view(({
    value, onchange = id, optionsView
}) => {
    let type = getDataTypePath(value.path);

    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    let renderInputArea = () => {
        let v = inputViewMap[type];

        return v && v({
            content: value.value || DEFAULT_DATA_MAP[type],
            type: value.type,
            placeholder: value.placeholder,
            onchange: onValueChanged
        });
    };

    return n('div', {
        style: {
            border: contain(INLINE_TYPES, type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
            minWidth: 160
        }
    }, [
        optionsView,

        n('div', {
            style: {
                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
            }
        }),

        !contain(INLINE_TYPES, type) ? fold({
            head: (ops) => n('div', {
                style: {
                    textAlign: 'right',
                    cursor: 'pointer'
                },
                'class': 'lambda-ui-hover',
                onclick: () => {
                    ops.toggle();
                }
            }, [
                ops.isHide() && n('span', {
                    style: {
                        color: '#9b9b9b',
                        paddingRight: 60
                    }
                }, abbreText(value.value)),

                foldArrow(ops)
            ]),

            body: renderInputArea,
            hide: false
        }) : renderInputArea()
    ]);
});

let abbreText = (data) => {
    let str = data;
    if (isObject(data)) {
        str = JSON.stringify(data);
    }
    if (str.length > 30) {
        return str.substring(0, 27) + '...';
    }
    return str;
};

const id = v => v;
