'use strict';

let {
    n, view
} = require('kabanery');

let TreeOptionView = require('./treeOptionView');

let SelectView = require('kabanery-select');

let {
    contain
} = require('bolzano');

let editor = require('kabanery-editor');

const DATA_TYPES = ['number', 'boolean', 'string', 'json', 'null'];

const [NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL] = DATA_TYPES;

const INLINE_TYPES = [NUMBER, BOOLEAN, STRING, NULL];

const id = v => v;

const DEFAULT_MAP = {
    [NUMBER]: 0,
    [BOOLEAN]: true,
    [STRING]: '',
    [JSON_TYPE]: '{\n\n}',
    [NULL]: null
};

/**
 * used to define json data
 */
module.exports = view((data, {
    update
}) => {
    let {
        value, onchange = id
    } = data;

    value = data.value = data.value || {};

    let onValueChanged = (v) => {
        value.value = v;
        onchange(v);
    };

    return n('div', {
        style: {
            border: contain(INLINE_TYPES, value.type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
            marginLeft: contain(INLINE_TYPES, value.type) ? -5 : 15,
            marginTop: 5,
            padding: 5,
            display: !value.type ? 'inline-block' : contain(INLINE_TYPES, value.type) ? 'inline-block' : 'block'
        }
    }, [
        n('div', {
            style: {
                display: !value.type ? 'block' : contain(INLINE_TYPES, value.type) ? 'inline-block' : 'block'
            }
        }, [
            TreeOptionView({
                path: value.type,
                data: {
                    [NUMBER]: 1,
                    [BOOLEAN]: 1,
                    [STRING]: 1,
                    [JSON_TYPE]: 1,
                    [NULL]: 1
                },
                onselected: (v, path) => {
                    onValueChanged(DEFAULT_MAP[path]);

                    update([
                        ['value.type', path]
                    ]);
                }
            })
        ]),

        value.type === NUMBER && n('input type="number"', {
            value: value.value || DEFAULT_MAP[value.type],
            oninput: (e) => {
                let num = Number(e.target.value);
                onValueChanged(num);
            }
        }),

        value.type === BOOLEAN && SelectView({
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

        value.type === STRING && n('input type="text"', {
            value: value.value || DEFAULT_MAP[value.type],
            oninput: (e) => {
                onValueChanged(e.target.value);
            }
        }),

        value.type === JSON_TYPE && n('div', {
            style: {
                marginLeft: 15,
                width: 600,
                height: 500
            }
        }, [
            editor({
                content: JSON.stringify(value.value, null, 4) || DEFAULT_MAP[value.type],
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

        value.type === NULL && n('span', 'null'),
    ]);
});
