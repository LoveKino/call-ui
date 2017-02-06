'use strict';

module.exports = `
.lambda-ui {
    font-size: 14px;
}

.lambda-variable fieldset{
    display: inline-block;
    border: 1px solid rgba(200, 200, 200, 0.4);
    border-radius: 5px;
    padding: 3px 4px;
}

.lambda-variable input{
    width: 30px !important;
    min-width: 30px !important;
    outline: none;
} 

.lambda-params fieldset{
    padding: 1px 4px;
    border: 0;
}

.lambda-ui-hover:hover{
    background-color: #f5f5f5 !important;
}

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

.lambda-ui .expandor-wrapper {
    position: relative;
    display: inline-block;
    border-radius: 5px;
}

.lambda-ui .expression-wrapper {
    display: inline-block;
    padding: 8px;
    border: 1px solid rgba(200, 200, 200, 0.4);
    border-radius: 5px
}
`;
