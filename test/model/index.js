'use strict';

let {
    dsl, interpreter
} = require('leta');

let {
    getLambda
} = require('../../src/model');

let assert = require('assert');

let {
    v, r, getJson
} = dsl;

let method = dsl.require;

describe('model', () => {
    it('getLambda: predicate', () => {
        let run = interpreter({
            math: {
                '+': (a, b) => a + b
            }
        });

        assert.equal(
            run(
                getJson(
                    getLambda({
                        path: 'predicate.math.+',
                        params: [{
                            path: 'data.number',
                            value: 10
                        }, {
                            path: 'data.number',
                            value: 20
                        }]
                    })
                )
            ),

            30
        );
    });
});
