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
module.exports = view(({
    type,
    onchange = id
}, {
    update
}) => {
    return n('div', [
        n('div', {
            style: {
                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
            }
        }, [
            TreeOptionView({
                data: {
                    [NUMBER]: 1,
                    [BOOLEAN]: 1,
                    [STRING]: 1,
                    [JSON_TYPE]: 1,
                    [NULL]: 1
                },
                onselected: (v, path) => {
                    onchange(DEFAULT_MAP[path]);

                    update([
                        ['type', path]
                    ]);
                }
            })
        ]),

        type === NUMBER && n('input type="number"', {
            value: DEFAULT_MAP[type],
            oninput: (e) => {
                let num = Number(e.target.value);
                onchange(num);
            }
        }),

        type === BOOLEAN && SelectView({
            options: [
                ['true'],
                ['false']
            ],
            onchange: (v) => {
                let ret = false;
                if (v === 'true') {
                    ret = true;
                }

                onchange(ret);
            }
        }),

        type === STRING && n('input type="text"', {
            value: DEFAULT_MAP[type],
            oninput: (e) => {
                onchange(e.target.value);
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
                content: DEFAULT_MAP[type],
                onchange: (v) => {
                    // TODO catch
                    try {
                        let jsonObject = JSON.parse(v);
                        onchange(jsonObject);
                    } catch (err) {
                        onchange(err);
                    }
                }
            })
        ]),

        type === NULL && n('span', 'null'),
    ]);
});
