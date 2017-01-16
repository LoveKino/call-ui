'use strict';

let {
    n, view
} = require('kabanery');

let {
    map, mergeMap
} = require('bolzano');

module.exports = view(({
    args,
    expressionInfo,
    expressionView,
    onchange = id,
        params = []
}) => {
    return () => n('div', {
        'class': 'lambda-params'
    }, [
        map(args, ({
            name
        }, index) => {
            return n('fieldset', {
                style: {
                    padding: '4px'
                }
            }, [
                expressionView(mergeMap(expressionInfo, {
                    defaultTitle: name,
                    value: params[index],
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
