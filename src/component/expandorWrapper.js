'use strict';

let {
    n
} = require('kabanery');

module.exports = (expView, expandor) => {
    return n('div class="expandor-wrapper"', [
        // expression
        n('div class="expression-wrapper"', expView),

        // expandor
        expandor
    ]);
};
