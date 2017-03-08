'use strict';

let {
    view, n
} = require('kabanery');

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
        n('textarea', {
            value: JSON.stringify(content, null, 4) || '{}',
            oninput: (e) => {
                let v = e.target.value;
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
