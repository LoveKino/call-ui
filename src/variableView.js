'use strict';

let {
    n, view
} = require('kabanery');

let InputList = require('kabanery-dynamic-listview/lib/inputList');

// used to define variables
module.exports = view(({
    title
}) => {
    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            listData: [],
            title
        })
    ]);
});
