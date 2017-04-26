'use strict';

let {
    n
} = require('kabanery');

let {
    map
} = require('bolzano');

let {
    PREDICATE
} = require('../../src/const');

let form = ({
    value,
    expressionType,
    getSuffixParams
}, {
    title,
    inline = true
} = {}) => {
    let parts = value.path.split('.');
    title = title || parts[parts.length - 1];

    return n('form class="expression-wrapper"', {
        onclick: (e) => {
            e.preventDefault();
        }
    }, [
        n('h3', title),

        map(getSuffixParams(0), (item) => {
            return n('div', {
                style: {
                    padding: 8,
                    display: inline ? 'inline-block' : 'block'
                }
            }, item);
        })
    ]);
};

form.detect = ({
    expressionType
}) => {
    return expressionType === PREDICATE;
};

module.exports = form;
