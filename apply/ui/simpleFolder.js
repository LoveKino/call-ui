'use strict';

let fold = require('kabanery-fold');

let foldArrow = require('kabanery-fold/lib/foldArrow');

let {
    n
} = require('kabanery');

let {
    map
} = require('bolzano');

let {
    PREDICATE
} = require('../../src/const');

let simpleFolder = ({
    value,
    expressionType,
    getSuffixParams
}, {
    title, hide
}) => {
    let parts = value.path.split('.');
    title = title || parts[parts.length - 1];

    return fold({
        head: (ops) => n('div', {
            style: {
                cursor: 'pointer'
            },
            onclick: () => {
                ops.toggle();
            }
        }, [
            foldArrow(ops),

            n('span', {
                style: {
                    color: '#9b9b9b'
                }
            }, title)
        ]),

        body: () => {
            return map(getSuffixParams(0), (item) => {
                return n('div', {
                    style: {
                        padding: 8
                    }
                }, item);
            });
        },

        hide
    });
};

simpleFolder.detect = ({
    expresionType
}) => {
    return expresionType === PREDICATE;
};

module.exports = simpleFolder;
