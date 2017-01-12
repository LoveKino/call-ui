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

/**
 * used to define json data
 */
module.exports = view(({
    type
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
                    update([
                        ['type', path]
                    ]);
                }
            })
        ]),

        //n('input')
        type === NUMBER && n('input type="number"'),
        type === BOOLEAN && SelectView({
            options: [
                ['true'],
                ['false']
            ]
        }),
        type === STRING && n('input type="text"'),
        type === JSON_TYPE && n('div', {
            style: {
                marginLeft: 15,
                width: 600,
                height: 500
            }
        }, [
            editor({
                content: ''
            })
        ]),
        type === NULL && n('span', 'null'),
    ]);
});
