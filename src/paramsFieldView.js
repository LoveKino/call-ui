'use strict';

let {
    n, view
} = require('kabanery');

let {
    map, mergeMap
} = require('bolzano');

module.exports = view(({
    args,
    context,
    expressionView,
    onchange = id, params = []
}) => {
    return () => n('div', {
        'class': 'lambda-params'
    }, [
        map(args, ({
            name
        }, index) => {
            let value = params[index] || {};
            value.title = name;

            return n('fieldset', {
                style: {
                    padding: '4px'
                }
            }, [
                expressionView(mergeMap(context, {
                    value,
                    onchange: (expressionValue) => {
                        params[index] = expressionValue;
                        onchange(params);
                    }
                }))
            ]);
        })
    ]);
});

const id = v => v;
