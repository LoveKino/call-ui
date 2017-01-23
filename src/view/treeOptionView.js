'use strict';

let {
    view, n
} = require('kabanery');

let {
    mergeMap
} = require('bolzano');

let {
    isFunction
} = require('basetype');

let TreeSelect = require('kabanery-tree-select');

let triangle = require('css-shapes-object/lib/triangle');

let {
    PREDICATE, VARIABLE
} = require('../const');

const DEFAULT_TITLE = 'please select';

module.exports = view(({
    path,
    data,
    showSelectTree,
    onselected,
    title,
    pathMapping,
    nameMap
}, {
    update
}) => {
    return n('label', {
        style: {
            position: 'relative',
            display: 'inline-block'
        }
    }, [
        path && title && n('div', {
            style: {
                fontSize: 14
            }
        }, title),

        n('div', {
            style: {
                paddingRight: 8,
                cursor: 'pointer',
                backgroundColor: showSelectTree ? 'rgba(200, 200, 200, .12)' : 'none'
            },

            'class': 'lambda-ui-hover',

            onclick: () => {
                update('showSelectTree', !showSelectTree);
            }
        }, path ? renderGuideLine(path, pathMapping) : n('div class="input-style"', {
            style: {
                color: '#9b9b9b',
                overflow: 'auto'
            }
        }, [
            n('span', {
                style: {
                    fontSize: 12
                }
            }, title || DEFAULT_TITLE),

            n('div', {
                style: mergeMap(triangle({
                    direction: 'down',
                    top: 5,
                    left: 5,
                    right: 5,
                    color: '#737373'
                }), {
                    display: 'inline-block',
                    'float': 'right',
                    position: 'relative',
                    top: 5
                })
            })
        ])),

        n('div', {
            style: {
                position: 'absolute',
                backgroundColor: 'white',
                zIndex: 10000,
                fontSize: 14
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
                },
                nameMap
            })
        ])
    ]);
});

/**
 * @param path string
 */
let renderGuideLine = (path, pathMapping) => {
    let parts = path.split('.');
    let last = parts.pop();
    let type = parts[0];

    return n('span', [
        n('span', {
            style: {
                fontWeight: (type === PREDICATE || type === VARIABLE) ? 'bold' : 'inherit',
                fontSize: type === PREDICATE ? 16 : 12,
                color: '#b4881d',
                padding: '0 5px'
            }
        }, last),

        (type === PREDICATE || type === VARIABLE) && parts.length && n('span', {
            style: {
                paddingLeft: 10
            }
        }, pathMapping ? pathMapping(parts) : `(${parts.join(' > ')})`)
    ]);
};
