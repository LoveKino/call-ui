'use strict';

module.exports = `
.lambda-ui input[type=text]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=text]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui input[type=password]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=password]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui input[type=number]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=number]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui .input-style {
    border: 0;
    display: inline-block;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui label {
    font-size: 14px;
    margin-right: 8px;
    color: #666666;
}

.lambda-ui fieldset {
    border: 0;
}

.lambda-ui button {
    min-width: 100px;
}

.lambda-ui button {
    min-width: 40px;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 20px;
    background-color: #3b3a36;
    color: white;
    border: none;
    text-decoration: none;
}
 
.lambda-ui button:hover {
    background-color: #b3c2bf;
    cursor: pointer;
}

.lambda-ui button:focus {
    outline: none;
}

.lambda-ui button:active {
    background-color: #e9ece5;
}
`;
