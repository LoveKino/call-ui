'use strict';

let {
    n, view
} = require('kabanery');

let InputList = require('kabanery-dynamic-listview/lib/inputList');

let {
    reduce, map
} = require('bolzano');

// used to define variables
// TODO variables detect
module.exports = view((data) => {
    let {
        title,
        variables = [], onchange = v => v
    } = data;

    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            value: map(variables, (variable) => {
                return variable || '';
            }),

            title: n('span', {
                style: {
                    color: '#9b9b9b',
                    fontSize: 14
                }
            }, title),

            onchange: (v) => {
                // TODO check variable definition
                onchange(reduce(v, (prev, item) => {
                    item && prev.push(item.trim());
                    return prev;
                }, []));

                data.variables = v;
            }
        })
    ]);
});
