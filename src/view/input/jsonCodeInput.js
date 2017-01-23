'use strict';

let {
    view, n
} = require('kabanery');

let editor = require('kabanery-editor');

module.exports = view((data) => {
    let {
        content,
        onchange
    } = data;

    return n('div', {
        style: {
            marginLeft: 15,
            width: 600,
            height: 500
        }
    }, [
        editor({
            content: JSON.stringify(content, null, 4) || '{}',
            onchange: (v) => {
                try {
                    let jsonObject = JSON.parse(v);
                    data.content = jsonObject;
                    onchange && onchange(jsonObject);
                } catch (err) {
                    onchange(err);
                }
            }
        })
    ]);
});
