'use strict';

let {
    n, view
} = require('kabanery');

let {
    map, mergeMap
} = require('bolzano');

module.exports = view(({
    args,
    itemRender,
    onchange = id, params = []
}) => {
    return () => n('div', {
        'class': 'lambda-params',
        style: {
            display: 'inline-block'
        }
    }, [
        map(args, ({
            name,
            content
        }, index) => {
            let value = mergeMap(params[index] || {}, content || {});

            return n('fieldset', {
                style: {
                    padding: '4px'
                }
            }, [
                itemRender({
                    title: name,

                    content: value,

                    onchange: (itemValue) => {
                        params[index] = itemValue;
                        onchange(params);
                    }
                })
            ]);
        })
    ]);
});

const id = v => v;
