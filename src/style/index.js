'use strict';

const LAMBDA_STYLE = require('./defaultStyle');

let {
    n
} = require('kabanery');

module.exports = ({
    styleStr = LAMBDA_STYLE
} = {}) => {
    let $style = document.getElementById('lambda-style');
    if (!$style) {
        $style = n('style id="lambda-style" type="text/css"', styleStr);
        document.getElementsByTagName('head')[0].appendChild($style);
    }
};
