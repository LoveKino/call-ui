'use strict';

let {
    view, n
} = require('kabanery');

let {
    isFunction
} = require('basetype');

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
            position: 'relative',
            display: 'inline-block'
        }
    }, [
        n('div', {
            style: {
                border: !path ? '1px solid rgba(200, 200, 200, 0.8)' : 'none',
                backgroundColor: showSelectTree ? '#F5F5F5' : 'transparent'
            },

            'class': 'lambda-guide-line',

            onclick: () => {
                update('showSelectTree', !showSelectTree);
            }
        }, path ? renderGuideLine(path) : n('span', 'please select')),

        n('div', {
            style: {
                position: 'absolute',
                backgroundColor: 'white',
                zIndex: 10000
            }
        }, [
            showSelectTree && TreeSelect({
                data: isFunction(data) ? data() : data,
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

/**
 * @param path string
 */
let renderGuideLine = (path) => {
    return n('span', {
        style: {
            color: '#85981f'
        }
    }, `> ${path.split('.').join(' > ')}`);
};
