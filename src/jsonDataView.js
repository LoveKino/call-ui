'use strict';

let {
    n, view
} = require('kabanery');

let SelectView = require('kabanery-select');

let {
    contain
} = require('bolzano');

let editor = require('kabanery-editor');

const {
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, INLINE_TYPES, DEFAULT_DATA_MAP
} = require('./const');

const id = v => v;

/**
 * used to define json data
 */
module.exports = view((data) => {
    let {
        value, onchange = id
    } = data;

    let getLambda = () => {
        return value.value;
    };

    onchange(getLambda());

    let onValueChanged = (v) => {
        value.value = v;
        onchange(v);
    };

    let type = getDataTypePath(value.path);

    return n('div', {
        style: {
            border: contain(INLINE_TYPES, type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
            marginTop: 5,
            padding: 5,
            display: !type ? 'inline-block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
        }
    }, [
        n('div', {
            style: {
                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
            }
        }),

        type === NUMBER && n('input type="number"', {
            value: value.value || DEFAULT_DATA_MAP[type],
            oninput: (e) => {
                let num = Number(e.target.value);
                onValueChanged(num);
            }
        }),

        type === BOOLEAN && SelectView({
            options: [
                ['true'],
                ['false']
            ],
            selected: value.value === true ? 'true' : 'false',
            onchange: (v) => {
                let ret = false;
                if (v === 'true') {
                    ret = true;
                }
                onValueChanged(ret);
            }
        }),

        type === STRING && n('input type="text"', {
            value: value.value || DEFAULT_DATA_MAP[type],
            oninput: (e) => {
                onValueChanged(e.target.value);
            }
        }),

        type === JSON_TYPE && n('div', {
            style: {
                marginLeft: 15,
                width: 600,
                height: 500
            }
        }, [
            editor({
                content: JSON.stringify(value.value, null, 4) || DEFAULT_DATA_MAP[type],
                onchange: (v) => {
                    // TODO catch
                    try {
                        let jsonObject = JSON.parse(v);
                        onValueChanged(jsonObject);
                    } catch (err) {
                        onValueChanged(err);
                    }
                }
            })
        ]),

        type === NULL && n('span', 'null'),
    ]);
});

let getDataTypePath = (path = '') => path.split('.').slice(1).join('.');
