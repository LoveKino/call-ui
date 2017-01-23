'use strict';

let {
    view, n
} = require('kabanery');

let TreeOptionView = require('../view/treeOptionView');

let {
    expressionTypes
} = require('../model');

module.exports = view(({
    data, onselected
}) => {
    let {
        title, value, showSelectTree, pathMapping, nameMap, expressAbility
    } = data;

    let optionData = expressAbility ? expressAbility(data) : expressionTypes(data);

    return n('div', {
        style: {
            color: '#9b9b9b',
            fontSize: 12,
            display: 'inline-block'
        }
    }, [
        TreeOptionView({
            title,
            showSelectTree,
            pathMapping,
            nameMap,
            onselected,
            path: value.path, data: optionData
        })
    ]);
});
