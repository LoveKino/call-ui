'use strict';

let {
    n, view
} = require('kabanery');

let InputList = require('kabanery-dynamic-listview/lib/inputList');

let {
    reduce
} = require('bolzano');

// used to define variables
module.exports = view(({
    title,
    onchange = v => v
}) => {
    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            listData: [],
            title,
            onchange: (v) => {
                // TODO check variable definition
                onchange(reduce(v, (prev, item) => {
                    item.value && prev.push(item.value.trim());
                    return prev;
                }, []));
            }
        })
    ]);
});
