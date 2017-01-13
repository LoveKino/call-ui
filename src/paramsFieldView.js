'use strict';

let {
    n, view
} = require('kabanery');

let {
    map
} = require('bolzano');

module.exports = view(({
    args,
    predicates,
    predicatesMetaInfo,
    expressionView,
    onchange = id
}) => {
    let params = [];

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
                name && n('label', {
                    style: {
                        marginRight: 10
                    }
                }, name),

                expressionView({
                    predicatesMetaInfo,
                    predicates,
                    onchange: (expressionValue) => {
                        params[index] = expressionValue;

                        onchange(params);
                    }
                })
            ]);
        })
    ]);
});

const id = v => v;
