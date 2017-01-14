'use strict';

let {
    n, view
} = require('kabanery');

let {
    dsl
} = require('leta');

let {
    v
} = dsl;

module.exports = view(({
    value,
    onchange = v => v
}) => {
    let getLambda = () => {
        return v(getVariableName(value.path));
    };

    onchange(getLambda());

    return () => n('div');
});

let getVariableName = (path) => {
    let parts = path.split('.');
    parts.shift();
    return parts.join('.');
};
