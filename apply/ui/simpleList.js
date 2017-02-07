'use strict';

let InputList = require('kabanery-dynamic-listview/lib/inputList');

let {
    JSON_DATA
} = require('../../src/const');

let {
    n
} = require('kabanery');

let {
    mergeMap
} = require('bolzano');

let simpleList = ({
    value,
    onchange
}, {
    defaultItem,
    title,
    itemRender,

    itemOptions = {}
}) => {
    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    return InputList({
        onchange: onValueChanged,

        value: value.value,
        defaultItem,
        itemRender,
        itemOptions: mergeMap({
            style: {
                marginLeft: 10
            }
        }, itemOptions),

        title: n('span', {
            style: {
                paddingLeft: 12,
                color: '#666666'
            }
        }, [title])
    });
};

simpleList.detect = ({
    expresionType
}) => expresionType === JSON_DATA;

module.exports = simpleList;
