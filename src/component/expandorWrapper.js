'use strict';

let {
    n
} = require('kabanery');

module.exports = (expView, expandor) => {
    return n('div', {
        style: {
            position: 'relative',
            display: 'inline-block',
            borderRadius: 5
        }
    }, [
        // expression
        n('div', {
            style: {
                display: 'inline-block',
                padding: 8,
                border: '1px solid rgba(200, 200, 200, 0.4)',
                borderRadius: 5
            }
        }, expView),

        // expandor
        expandor
    ]);
};
