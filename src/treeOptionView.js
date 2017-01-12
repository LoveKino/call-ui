'use strict';

let {
    view, n
} = require('kabanery');

let TreeSelect = require('kabanery-tree-select');

module.exports = view(({
    path,
    data,
    showSelectTree,
    onselected
}, {
    update
}) => {
    return n('div', {
        style: {
            position: 'relative'
        }
    }, [
        n('div', {
            style: {
                border: '1px solid rgba(200, 200, 200, 0.8)',
                borderRadius: 6,
                padding: 5,
                cursor: 'pointer',
                width: 160
            },

            onclick: () => {
                update('showSelectTree', !showSelectTree);
            }
        }, path ? n('span', path) : n('span', 'please select')),

        n('div', {
            style: {
                position: 'absolute',
                backgroundColor: 'white'
            }
        }, [
            showSelectTree && TreeSelect({
                data,
                onselected: (v, p) => {
                    onselected && onselected(v, p);
                    update([
                        ['path', p],
                        ['showSelectTree', false]
                    ]);
                }
            })
        ])
    ]);
});
