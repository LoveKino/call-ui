'use strict';

let getLambdaUiValue = require('../../src/model/getLambdaUiValue');

let assert = require('assert');

let {
    dsl
} = require('leta');

let {
    method, getJson, v, r
} = dsl;

describe('getLambdaUiValue', () => {
    it('simple predicate', () => {
        assert.deepEqual(
            getLambdaUiValue(
                getJson(
                    method('math.+')(1, 2)
                )
            ), {
                path: 'predicate.math.+',
                params: [{
                    path: 'data.number',
                    value: 1
                }, {
                    path: 'data.number',
                    value: 2
                }]
            }
        );
    });

    it('simple meta', () => {
        assert.deepEqual(
            getLambdaUiValue(
                getJson({
                    a: 1
                })
            ),

            {
                path: 'data.json',
                value: {
                    a: 1
                }
            }
        );
    });

    it('simple variable', () => {
        assert.deepEqual(
            getLambdaUiValue(
                getJson(v('x'))
            ),

            {
                path: 'variable.x'
            }
        );
    });

    it('simple abstraction', () => {
        assert.deepEqual(
            getLambdaUiValue(
                getJson(
                    r('x', method('math.+')(v('x'), 1))
                )
            ),

            {
                'path': 'abstraction',
                'expression': {
                    'path': 'predicate.math.+',
                    'params': [{
                        'path': 'variable.x'
                    }, {
                        'path': 'data.number',
                        'value': 1
                    }]
                },
                'variables': ['x']
            }
        );
    });
});
