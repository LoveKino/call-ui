/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    RealLetaUI, meta, method
	} = __webpack_require__(1);

	let {
	    view
	} = __webpack_require__(4);

	let simpleForm = __webpack_require__(93);

	let simpleInput = __webpack_require__(94);

	let simpleSelect = __webpack_require__(95);

	let ProjectView = view((data, {
	    update
	}) => {
	    let setProject = method('setProject');
	    let setAndroidProjectOptions = method('setAndroidProjectOptions');
	    let setWebProjectOptions = method('setWebProjectOptions');

	    return RealLetaUI(
	        // initial state
	        setProject(
	            '',
	            data.projectType,
	            data.projectType === 'web' ? setWebProjectOptions('') : setAndroidProjectOptions('')
	        ),

	        {
	            predicates: {
	                setProject: meta((name, type, optionObj) => {
	                    console.log(name, type, optionObj); // eslint-disable-line
	                    if (type !== data.projectType) {
	                        update('projectType', type);
	                    }
	                }, {
	                    viewer: simpleForm,
	                    args: [{
	                        viewer: simpleInput,
	                        title: 'name'
	                    }, {
	                        viewer: simpleSelect,
	                        title: 'projectType',
	                        options: [
	                            ['web'],
	                            ['android']
	                        ]
	                    }]
	                }),

	                setWebProjectOptions: meta((url) => {
	                    return {
	                        url
	                    };
	                }, {
	                    viewer: simpleForm,
	                    args: [{
	                        viewer: simpleInput,
	                        title: 'url'
	                    }]
	                }),

	                setAndroidProjectOptions: meta((packageName) => {
	                    return {
	                        packageName
	                    };
	                }, {
	                    viewer: simpleForm,
	                    args: [{
	                        viewer: simpleInput,
	                        title: 'packageName'
	                    }]
	                })
	            }
	        });
	});

	document.body.appendChild(ProjectView({
	    projectType: 'web'
	}));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let LetaUIView = __webpack_require__(3);

	let {
	    runner, getLambdaUiValue
	} = __webpack_require__(35);

	let {
	    dsl
	} = __webpack_require__(36);

	let {
	    mergeMap
	} = __webpack_require__(38);

	let meta = __webpack_require__(92);

	let {
	    getJson, method, v, r
	} = dsl;

	let LetaUI = (...args) => {
	    let data = getData(args);
	    let runLeta = runner(data.predicates);

	    return LetaUIView(mergeMap(data, {
	        onchange: (v) => {
	            data.onchange && data.onchange(v, {
	                runLeta
	            });
	        },

	        runLeta
	    }));
	};

	let getData = (args) => {
	    let data = null;
	    if (args.length === 1) {
	        data = args[0];
	    } else if (args.length === 2) {
	        data = args[1];
	        data.value = getLambdaUiValue(
	            getJson(args[0])
	        ); // convert lambda json
	    } else {
	        throw new Error(`unexpected number of arguments. Expect one or two but got ${args.length}`);
	    }

	    data = data || {};

	    return data;
	};

	let RealLetaUI = (...args) => {
	    let data = getData(args);
	    data.onchange = data.onchange || realOnchange;
	    return LetaUI(data);
	};

	let realOnchange = (v, {
	    runLeta
	}) => {
	    runLeta(v);
	};

	module.exports = {
	    method,
	    v,
	    r,
	    meta,
	    runner,

	    LetaUI,
	    RealLetaUI
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	let ExpandorComponent = __webpack_require__(34);

	let TreeOptionView = __webpack_require__(48);

	let Expandor = __webpack_require__(61);

	let {
	    getPrefixParamser,
	    getSuffixParamser,
	    getParamer
	} = __webpack_require__(63);

	let {
	    mergeMap, get, map
	} = __webpack_require__(38);

	let getExpressionViewer = __webpack_require__(64);

	const style = __webpack_require__(89);

	let {
	    JSON_DATA,
	    ABSTRACTION,
	    VARIABLE,
	    PREDICATE
	} = __webpack_require__(46);

	let {
	    getExpressionType,
	    completeDataWithDefault,
	    completeValueWithDefault,
	    expressionTypes,
	    isUIPredicate,
	    getUIPredicatePath
	} = __webpack_require__(35);

	/**
	 * lambda UI editor
	 *
	 * π calculus
	 *
	 * e ::= x              a variable
	 *   |   חx.e           an abstraction (function)
	 *   |   e₁e₂           a (function) application
	 *
	 * 1. meta data
	 *    json
	 *
	 * 2. predicate
	 *    f(x, ...)
	 *
	 * 3. variable
	 *    x
	 *
	 * 4. abstraction
	 *    חx₁x₂...x.e
	 *
	 * 5. application
	 *    e₁e₂e₃...
	 *
	 * ח based on predicates and json expansion
	 *
	 * e ::= json                    as meta data, also a pre-defined π expression
	 *   |   x                       variable
	 *   |   predicate               predicate is a pre-defined abstraction
	 *   |   חx.e                    abstraction
	 *   |   e1e2                    application
	 */

	/**
	 * expression user interface
	 *
	 * 1. user choses expression type
	 * 2. define current expression type
	 *
	 * data = {
	 *      predicates,
	 *      predicatesMetaInfo: {
	 *          ... {
	 *              args: [{
	 *                  name,
	 *                  defaultValue: value
	 *              }]
	 *          }
	 *      },
	 *
	 *      value: {
	 *          path
	 *      }
	 * }
	 *
	 * TODO: application option
	 */
	module.exports = view((data = {}) => {
	    style({
	        style: data.styleStr
	    });

	    return n('div', {
	        'class': 'lambda-ui'
	    }, [
	        expressionView(data)
	    ]);
	});

	let expressionView = view((data, {
	    update
	}) => {
	    data = completeDataWithDefault(data);

	    return () => {
	        let {
	            value,
	            infixPath,

	            // events
	            onchange,

	            runLeta
	        } = data;

	        completeValueWithDefault(value);

	        if (isUIPredicate(value.path)) {
	            //
	            let render = get(data.UI, getUIPredicatePath(value.path));
	            return expressionView(mergeMap(data, {
	                viewer: (expOptions) => render(expOptions, ...map(value.params.slice(1), (item) => {
	                    return runLeta(item);
	                })),
	                value: value.params[0]
	            }));
	        }

	        if (data.infixPath) {
	            return expressionView(mergeMap(data, {
	                infixPath: null,
	                value: {
	                    path: infixPath,
	                    params: [value],
	                    infix: 1
	                }
	            }));
	        }

	        onchange(value);

	        let expressionOptions = getExpressionViewOptions(data, update);
	        return getExpressionViewer(data, expressionOptions)(expressionOptions);
	    };
	});

	let getExpressionViewOptions = (data, update) => {
	    let {
	        value,
	        variables,

	        // global config
	        predicates,
	        predicatesMetaInfo,
	        UI,
	        nameMap,

	        // ui states
	        title,
	        guideLine,
	        showSelectTree,

	        // events
	        onchange,

	        runLeta
	    } = data;

	    let globalConfig = {
	        predicates,
	        runLeta,
	        UI,
	        predicatesMetaInfo,
	        nameMap
	    };

	    let getOptionsView = (OptionsView = TreeOptionView) => OptionsView({
	        path: value.path,
	        data: expressionTypes(data),
	        title,
	        guideLine,
	        showSelectTree,
	        nameMap,
	        onselected: (v, path) => {
	            update([
	                ['value.path', path],
	                ['showSelectTree', false]
	            ]);
	        }
	    });

	    let getExpandor = (ExpandorView = Expandor) => data.value.path && ExpandorComponent({
	        onExpand: (hide) => {
	            update();
	            data.onexpandchange && data.onexpandchange(hide, data);
	        },

	        onselected: () => {
	            update();
	        },

	        data,

	        ExpandorView
	    });

	    let getAbstractionBody = () => {
	        let expressionViewObj = mergeMap(globalConfig, {
	            title: 'expression',
	            value: value.expression,
	            variables: variables.concat(value.currentVariables),
	            onchange: (lambda) => {
	                value.expression = lambda;
	                onchange && onchange(value);
	            }
	        });

	        return {
	            getView: () => {
	                return expressionView(expressionViewObj);
	            },

	            updateVariables: (vars) => {
	                expressionViewObj.variables = vars;
	            }
	        };
	    };

	    let prefixParamItemRender = (opts) => expressionView(
	        mergeMap(mergeMap(globalConfig, {
	            variables,
	            onexpandchange: (hide, data) => {
	                // close infix mode
	                update([
	                    ['infixPath', null],
	                    ['value', data.value],
	                    ['title', '']
	                ]);
	            }
	        }), opts)
	    );

	    let suffixParamItemRender = (opts) => expressionView(
	        mergeMap(mergeMap(globalConfig, {
	            variables
	        }), opts)
	    );

	    let expressionType = getExpressionType(value.path);

	    switch (expressionType) {
	        case PREDICATE:
	            return {
	                getPrefixParams: getPrefixParamser(data, {
	                    // prefix param item
	                    itemRender: prefixParamItemRender
	                }),

	                value,

	                getSuffixParams: getSuffixParamser(data, {
	                    // suffix param item
	                    itemRender: suffixParamItemRender
	                }),

	                getParam: getParamer(data, {
	                    // suffix param item
	                    itemRender: suffixParamItemRender
	                }),

	                getOptionsView,

	                getExpandor,

	                expressionType
	            };
	        case JSON_DATA:
	            return {
	                value,
	                onchange,
	                getOptionsView,
	                getExpandor,

	                expressionType
	            };
	        case VARIABLE:
	            return {
	                value,
	                getOptionsView,
	                getExpandor,

	                expressionType
	            };
	        case ABSTRACTION:
	            return {
	                value,
	                variables,

	                getOptionsView,
	                getExpandor,

	                onchange,
	                expressionType,
	                expressionBody: getAbstractionBody(),
	            };
	        default:
	            return {
	                value,
	                getOptionsView,
	                getExpandor,

	                expressionType
	            };
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(5);

	/**
	 * @readme-quick-run
	 *
	 * Basic way to construct a view.
	 *
	 * [readme-lang:zh]构造一个组件的简单方法
	 *
	 * ## test tar=js r_c=kabanery env=browser
	 * let {view, n, mount} = kabanery;
	 *
	 * let MyView = view((data) => {
	 *      let {type} = data;
	 *
	 *      return n('div', {
	 *         id: 'a',
	 *         style: {
	 *            fontSize: 10
	 *         }
	 *      },[
	 *          type === 2 && n('span', 'second'),
	 *          type === 3 && n('div', 'third')
	 *      ]);
	 * });
	 *
	 * mount(MyView({type: 3}), document.body);
	 *
	 * console.log(document.getElementById('a').outerHTML); // print result
	 */

	/**
	 * @readme-quick-run
	 *
	 * Using update api to update a view.
	 *
	 * [readme-lang:zh]运用update api去更新一个view
	 *
	 * ## test tar=js r_c=kabanery env=browser
	 * let {view, n, mount} = kabanery;
	 *
	 * let MyView = view((data, {update}) => {
	 *      return n('div', {
	 *         id: 'a',
	 *         style: {
	 *            fontSize: 10
	 *         },
	 *         onclick: () => {
	 *            update('show', !data.show);
	 *         }
	 *      }, [
	 *          data.show && n('div', 'show text')
	 *      ]);
	 * });
	 *
	 * mount(MyView({show: false}), document.body);
	 *
	 * document.getElementById('a').click(); // simulate user action
	 * console.log(document.getElementById('a').outerHTML); // print result
	 */


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, svgn, bindPlugs
	} = __webpack_require__(6);

	let {
	    parseArgs
	} = __webpack_require__(7);

	let plugs = __webpack_require__(19);

	let view = __webpack_require__(26);

	let mount = __webpack_require__(32);

	let N = __webpack_require__(33);

	module.exports = {
	    n,
	    N,
	    svgn,
	    view,
	    plugs,
	    bindPlugs,
	    mount,

	    parseArgs
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    createElement, createSvgElement, parseArgs, nodeGener
	} = __webpack_require__(7);

	let {
	    bindEvents
	} = __webpack_require__(14);

	// TODO general proxy n way

	let cn = (create) => {
	    let nodeGen = nodeGener(create);
	    return (...args) => {
	        let {
	            tagName, attributes, childs
	        } = parseArgs(args);

	        // plugin
	        runPlugins(attributes['plugin'], tagName, attributes, childs);

	        let {
	            attrMap, eventMap
	        } = splitAttribues(attributes);

	        // TODO delay node gen operations
	        let node = nodeGen(tagName, attrMap, childs);

	        // tmp solution
	        bindEvents(node, eventMap);

	        return node;
	    };
	};

	let bindPlugs = (typen, plugs = []) => (...args) => {
	    let {
	        tagName, attributes, childs
	    } = parseArgs(args);

	    let oriPlugs = attributes.plugin = attributes.plugin || [];
	    attributes.plugin = oriPlugs.concat(plugs);

	    let node = typen(tagName, attributes, childs);

	    return node;
	};

	let runPlugins = (plugs = [], tagName, attributes, childExp) => {
	    for (let i = 0; i < plugs.length; i++) {
	        let plug = plugs[i];
	        plug && plug(tagName, attributes, childExp);
	    }
	};

	let splitAttribues = (attributes) => {
	    let attrMap = {},
	        eventMap = {};
	    for (let name in attributes) {
	        let item = attributes[name];
	        if (name.indexOf('on') === 0) {
	            eventMap[name.substring(2)] = item;
	        } else if (name !== 'plugin') {
	            attrMap[name] = item;
	        }
	    }
	    return {
	        attrMap,
	        eventMap
	    };
	};

	module.exports = {
	    n: cn(createElement),
	    svgn: cn(createSvgElement),
	    bindPlugs
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isString, isObject, isNode, likeArray, isNumber, isBool
	} = __webpack_require__(9);

	let parseAttribute = __webpack_require__(10);

	const svgNS = 'http://www.w3.org/2000/svg';

	let cn = (create) => {
	    let nodeGen = nodeGener(create);
	    return (...args) => {
	        let {
	            tagName, attributes, childs
	        } = parseArgs(args);
	        return nodeGen(tagName, attributes, childs);
	    };
	};

	let nodeGener = (create) => (tagName, attributes, childs) => {
	    let node = create(tagName);
	    applyNode(node, attributes, childs);

	    return node;
	};

	let parseArgs = (args) => {
	    let tagName,
	        attributes = {},
	        childExp = [];

	    let first = args.shift();

	    let parts = splitTagNameAttribute(first);

	    if (parts.length > 1) { // not only tagName
	        tagName = parts[0];
	        attributes = parts[1];
	    } else {
	        tagName = first;
	    }

	    tagName = tagName.toLowerCase().trim();

	    let next = args.shift();

	    let nextAttr = {};

	    if (likeArray(next) ||
	        isString(next) ||
	        isNode(next) ||
	        isNumber(next) ||
	        isBool(next)) {
	        childExp = next;
	    } else if (isObject(next)) {
	        nextAttr = next;
	        childExp = args.shift() || [];
	    }

	    attributes = parseAttribute(attributes, nextAttr);

	    let childs = parseChildExp(childExp);

	    return {
	        tagName,
	        attributes,
	        childs
	    };
	};

	let splitTagNameAttribute = (str = '') => {
	    let tagName = str.split(' ')[0];
	    let attr = str.substring(tagName.length);
	    attr = attr && attr.trim();
	    if (attr) {
	        return [tagName, attr];
	    } else {
	        return [tagName];
	    }
	};

	let applyNode = (node, attributes, childs) => {
	    setAttributes(node, attributes);
	    for (let i = 0; i < childs.length; i++) {
	        let child = childs[i];
	        if (isString(child)) {
	            node.textContent = child;
	        } else {
	            node.appendChild(child);
	        }
	    }
	};

	let setAttributes = (node, attributes) => {
	    for (let name in attributes) {
	        let attr = attributes[name];
	        node.setAttribute(name, attr);
	    }
	};

	let parseChildExp = (childExp) => {
	    let ret = [];
	    if (isNode(childExp)) {
	        ret.push(childExp);
	    } else if (likeArray(childExp)) {
	        for (let i = 0; i < childExp.length; i++) {
	            let child = childExp[i];
	            ret = ret.concat(parseChildExp(child));
	        }
	    } else if (childExp) {
	        ret.push(childExp.toString());
	    }
	    return ret;
	};

	let createElement = (tagName) => document.createElement(tagName);

	let createSvgElement = (tagName) => document.createElementNS(svgNS, tagName);

	module.exports = {
	    svgn: cn(createSvgElement),
	    n: cn(createElement),
	    parseArgs,
	    nodeGener,
	    createElement,
	    createSvgElement,
	    cn
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * basic types
	 */

	let truth = () => true;

	let isUndefined = v => v === undefined;

	let isNull = v => v === null;

	let isFalsy = v => !v;

	let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

	let isArray = v => Array.isArray(v);

	let isString = v => typeof v === 'string';

	let isObject = v => !!(v && typeof v === 'object');

	let isFunction = v => typeof v === 'function';

	let isNumber = v => typeof v === 'number' && !isNaN(v);

	let isBool = v => typeof v === 'boolean';

	let isNode = (o) => {
	    return (
	        typeof Node === 'object' ? o instanceof Node :
	        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	    );
	};

	let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

	let isRegExp = v => v instanceof RegExp;

	let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

	let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

	/**
	 * check type
	 *
	 * types = [typeFun]
	 */
	let funType = (fun, types = []) => {
	    if (!isFunction(fun)) {
	        throw new TypeError(typeErrorText(fun, 'function'));
	    }

	    if (!likeArray(types)) {
	        throw new TypeError(typeErrorText(types, 'array'));
	    }

	    for (let i = 0; i < types.length; i++) {
	        let typeFun = types[i];
	        if (typeFun) {
	            if (!isFunction(typeFun)) {
	                throw new TypeError(typeErrorText(typeFun, 'function'));
	            }
	        }
	    }

	    return function() {
	        // check type
	        for (let i = 0; i < types.length; i++) {
	            let typeFun = types[i];
	            let arg = arguments[i];
	            if (typeFun && !typeFun(arg)) {
	                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
	            }
	        }
	        // result
	        return fun.apply(this, arguments);
	    };
	};

	let and = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (!typeFun(v)) {
	                return false;
	            }
	        }
	        return true;
	    };
	};

	let or = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }

	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (typeFun(v)) {
	                return true;
	            }
	        }
	        return false;
	    };
	};

	let not = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => !type(v);
	};

	let any = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'list'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (!type(list[i])) {
	            return false;
	        }
	    }
	    return true;
	};

	let exist = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'array'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (type(list[i])) {
	            return true;
	        }
	    }
	    return false;
	};

	let mapType = (map) => {
	    if (!isObject(map)) {
	        throw new TypeError(typeErrorText(map, 'obj'));
	    }

	    for (let name in map) {
	        let type = map[name];
	        if (!isFunction(type)) {
	            throw new TypeError(typeErrorText(type, 'function'));
	        }
	    }

	    return (v) => {
	        if (!isObject(v)) {
	            return false;
	        }

	        for (let name in map) {
	            let type = map[name];
	            let attr = v[name];
	            if (!type(attr)) {
	                return false;
	            }
	        }

	        return true;
	    };
	};

	let listType = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    return (list) => any(list, type);
	};

	let typeErrorText = (v, expect) => {
	    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
	};

	module.exports = {
	    isArray,
	    likeArray,
	    isString,
	    isObject,
	    isFunction,
	    isNumber,
	    isBool,
	    isNode,
	    isPromise,
	    isNull,
	    isUndefined,
	    isFalsy,
	    isRegExp,
	    isReadableStream,
	    isWritableStream,

	    funType,
	    any,
	    exist,

	    and,
	    or,
	    not,
	    mapType,
	    listType,
	    truth
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isString, isObject
	} = __webpack_require__(9);

	let {
	    mergeMap
	} = __webpack_require__(11);

	const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

	// TODO better key=value grammer
	// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
	let parseAttribute = (attributes, nextAttr) => {
	    // key=value key=value
	    // value='abc' value=true value=123 value="def"
	    if (isString(attributes)) {
	        let str = attributes.trim(),
	            kvs = [];

	        let stop = false;
	        while (!stop) {
	            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
	                kvs.push([$1, $2]);
	                return '';
	            }).trim();
	            if (newstr === str) {
	                stop = true;
	            }
	            str = newstr;
	        }

	        attributes = {};
	        for (let i = 0; i < kvs.length; i++) {
	            let [key, value] = kvs[i];
	            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
	                value[0] === '"' && value[value.length - 1] === '"') {
	                value = value.substring(1, value.length - 1);
	            }
	            attributes[key] = value;
	        }
	    }
	    // merge
	    attributes = mergeMap(attributes, nextAttr);

	    if (attributes.style) {
	        attributes.style = getStyleString(attributes.style);
	    }

	    // TODO presudo
	    /*
	    if (attributes.presudo) {
	        for (let name in attributes.presudo) {
	            attributes.presudo[name] = getStyleString(attributes.presudo[name]);
	        }
	    }
	   */

	    return attributes;
	};

	let getStyleString = (attr = '') => {
	    if (isString(attr)) {
	        return attr;
	    }

	    if (!isObject(attr)) {
	        throw new TypeError(`Expect object for style object, but got ${attr}`);
	    }
	    let style = '';
	    for (let key in attr) {
	        let value = attr[key];
	        key = convertStyleKey(key);
	        value = convertStyleValue(value, key);
	        style = `${style};${key}: ${value}`;
	    }
	    return style;
	};

	let convertStyleKey = (key) => {
	    return key.replace(/[A-Z]/, (letter) => {
	        return `-${letter.toLowerCase()}`;
	    });
	};

	let convertStyleValue = (value, key) => {
	    if (typeof value === 'number' && key !== 'z-index') {
	        return value + 'px';
	    }
	    if (key === 'padding' || key === 'margin') {
	        let parts = value.split(' ');
	        for (let i = 0; i < parts.length; i++) {
	            let part = parts[i];
	            if (!isNaN(Number(part))) {
	                parts[i] = part + 'px';
	            }
	        }

	        value = parts.join(' ');
	    }
	    return value;
	};

	module.exports = parseAttribute;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(12);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(13);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(12);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let EventMatrix = __webpack_require__(15);

	let {
	    listenEventType,
	    attachDocument
	} = EventMatrix();

	let bindEvents = (node, eventMap) => {
	    // hook event at node
	    node.__eventMap = eventMap;

	    for (let type in eventMap) {
	        listenEventType(type);
	    }
	};

	module.exports = {
	    bindEvents,
	    attachDocument
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    contain
	} = __webpack_require__(16);

	module.exports = () => {
	    let docs = [];
	    let eventTypeMap = {};

	    let listenEventType = (type) => {
	        if (!eventTypeMap[type]) {
	            updateDocs(type);
	        }
	        eventTypeMap[type] = true;
	    };

	    /**
	     * attach document used to accept events
	     */
	    let attachDocument = (doc = document) => {
	        if (!contain(docs, doc)) {
	            for (let type in eventTypeMap) {
	                // prevent multiple version of kabanery to binding multiple times
	                let id = getGlobalEventTypeId(type);
	                if (!doc[id]) {
	                    doc.addEventListener(type, listener(type));
	                    doc[id] = true;
	                }
	            }
	            docs.push(doc);
	        }
	    };

	    let updateDocs = (type) => {
	        if (!docs.length) {
	            docs.push(document);
	        }
	        for (let i = 0; i < docs.length; i++) {
	            let doc = docs[i];
	            doc.addEventListener(type, listener(type));
	        }
	    };

	    let listener = (type) => function(e) {
	        let ctx = this;
	        let target = e.target;

	        // hack the stopPropagration function
	        let oldProp = e.stopPropagation;
	        e.stopPropagation = function(...args) {
	            e.__stopPropagation = true;
	            return oldProp.apply(this, args);
	        };

	        let nodePath = getNodePath(target);

	        for (let i = 0; i < nodePath.length; i++) {
	            let node = nodePath[i];
	            applyNodeHandlers(e, type, node, ctx);
	        }
	    };

	    let applyNodeHandlers = (e, type, node, ctx) => {
	        if (e.__stopPropagation) { // event already been stoped by child node
	            return true;
	        }

	        let handler = getHandler(type, node);
	        return handler && handler.apply(ctx, [e]);
	    };

	    let getHandler = (type, target) => {
	        let eventMap = target && target.__eventMap;
	        return eventMap && eventMap[type];
	    };

	    return {
	        listenEventType,
	        attachDocument
	    };
	};

	/**
	 * get the path of node
	 */
	let getNodePath = (target) => {
	    let paths = [];
	    while (target) {
	        paths.push(target);
	        target = target.parentNode;
	    }
	    return paths;
	};

	let getGlobalEventTypeId = (type) => `__event_type_id_${type}`;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(17);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(18);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(17);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let twowaybinding = __webpack_require__(20);
	let eventError = __webpack_require__(25);

	module.exports = {
	    twowaybinding,
	    eventError
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    get, set
	} = __webpack_require__(21);

	module.exports = (obj, path) => (tagName, attributes, childExp) => {
	    let value = get(obj, path, '');
	    if (tagName === 'input') {
	        attributes.value = value;
	    } else {
	        childExp.unshift(value);
	    }

	    if (!attributes.onkeyup) {
	        attributes.onkeyup = (e) => {
	            set(obj, path, e.target.value);
	        };
	    }
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(22);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(9);

	let defineProperty = (obj, key, opts) => {
	    if (Object.defineProperty) {
	        Object.defineProperty(obj, key, opts);
	    } else {
	        obj[key] = opts.value;
	    }
	    return obj;
	};

	let hasOwnProperty = (obj, key) => {
	    if (obj.hasOwnProperty) {
	        return obj.hasOwnProperty(key);
	    }
	    for (var name in obj) {
	        if (name === key) return true;
	    }
	    return false;
	};

	let toArray = (v = []) => Array.prototype.slice.call(v);

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let set = (sandbox, name = '', value) => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    let parent = sandbox;
	    if (!isObject(parent)) return;
	    if (!parts.length) return;
	    for (let i = 0; i < parts.length - 1; i++) {
	        let part = parts[i];
	        parent = parent[part];
	        // avoid exception
	        if (!isObject(parent)) return null;
	    }

	    parent[parts[parts.length - 1]] = value;
	    return true;
	};

	/**
	 * provide property:
	 *
	 * 1. read props freely
	 *
	 * 2. change props by provide token
	 */

	let authProp = (token) => {
	    let set = (obj, key, value) => {
	        let temp = null;

	        if (!hasOwnProperty(obj, key)) {
	            defineProperty(obj, key, {
	                enumerable: false,
	                configurable: false,
	                set: (value) => {
	                    if (isObject(value)) {
	                        if (value.token === token) {
	                            // save
	                            temp = value.value;
	                        }
	                    }
	                },
	                get: () => {
	                    return temp;
	                }
	            });
	        }

	        setProp(obj, key, value);
	    };

	    let setProp = (obj, key, value) => {
	        obj[key] = {
	            token,
	            value
	        };
	    };

	    return {
	        set
	    };
	};

	let evalCode = (code) => {
	    if (typeof code !== 'string') return code;
	    return eval(`(function(){
	    try {
	        ${code}
	    } catch(err) {
	        console.log('Error happened, when eval code.');
	        throw err;
	    }
	})()`);
	};

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let runSequence = (list, params = [], context, stopV) => {
	    if (!list.length) {
	        return Promise.resolve();
	    }
	    let fun = list[0];
	    let v = fun && fun.apply(context, params);
	    if (stopV && v === stopV) {
	        return Promise.resolve(stopV);
	    }
	    return Promise.resolve(v).then(() => {
	        return runSequence(list.slice(1), params, context, stopV);
	    });
	};

	module.exports = {
	    defineProperty,
	    hasOwnProperty,
	    toArray,
	    get,
	    set,
	    authProp,
	    evalCode,
	    delay,
	    runSequence
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(23);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(24);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(23);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	module.exports = (catcher) => (tagName, attributes) => {
	    for (let name in attributes) {
	        let item = attributes[name];
	        if (name.indexOf('on') === 0) {
	            if (typeof item === 'function') {
	                attributes[name] = wrapEventHandler(item, catcher);
	            }
	        }
	    }
	};

	let wrapEventHandler = (fun, catcher) => {
	    return function () {
	        try {
	            let ret = fun.apply(this, arguments);
	            ret = Promise.resolve(ret);
	            ret.catch(catcher);
	            return ret;
	        } catch (err) {
	            return catcher(err);
	        }
	    };
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    set
	} = __webpack_require__(21);

	let {
	    isObject, isFunction, likeArray
	} = __webpack_require__(9);

	let {
	    forEach
	} = __webpack_require__(16);

	let replace = __webpack_require__(27);

	/**
	 * render function: (data) => node
	 */

	// TODO observable for update, append

	// class level
	let View = (view, construct, {
	    afterRender
	} = {}) => {
	    // TODO class level API
	    // instance level
	    let viewer = (obj, initor) => {
	        // create context
	        let ctx = createCtx({
	            view, afterRender
	        });

	        return createView(ctx, obj, initor, construct);
	    };

	    let viewerOps = (viewer) => {
	        viewer.create = (handler) => {
	            let ctx = createCtx({
	                view, afterRender
	            });

	            handler && handler(ctx);

	            let inst = (obj, initor) => {
	                return createView(ctx, obj, initor, construct);
	            };

	            inst.ctx = ctx;

	            return inst;
	        };

	        // extend some context
	        viewer.expand = (ctxMap = {}) => {
	            let newViewer = (...args) => {
	                let obj = args[0];
	                args[0] = View.ext(obj, ctxMap);

	                return viewer(...args);
	            };

	            viewerOps(newViewer);
	            return newViewer;
	        };
	    };

	    viewerOps(viewer);

	    return viewer;
	};

	View.ext = (data, ctxMap = {}) => (ctx) => {
	    for (let name in ctxMap) {
	        ctx[name] = ctxMap[name];
	    }
	    if (isFunction(data)) {
	        return data(ctx);
	    }
	    return data;
	};

	let createView = (ctx, obj, initor, construct) => {
	    let data = ctx.initData(obj, ctx);
	    // only run initor when construct view
	    initor && initor(data, ctx);
	    construct && construct(data, ctx);

	    // render node
	    return ctx.replaceView();
	};

	let createCtx = ({
	    view, afterRender
	}) => {
	    let node = null,
	        data = null,
	        render = null;

	    let update = (...args) => {
	        if (!args.length) return replaceView();
	        if (args.length === 1 && likeArray(args[0])) {
	            let arg = args[0];
	            forEach(arg, (item) => {
	                set(data, item[0], item[1]);
	            });
	            return replaceView();
	        } else {
	            let [path, value] = args;

	            // function is a special data
	            if (isFunction(value)) {
	                value = value(data);
	            }

	            set(data, path, value);
	            return replaceView();
	        }
	    };

	    let append = (item, viewFun) => {
	        if (node) {
	            node.appendChild(viewFun(item));
	        }
	    };

	    let replaceView = () => {
	        let newNode = getNewNode();

	        // type check for newNode

	        node = replace(node, newNode);

	        afterRender && afterRender(ctx);

	        if (node) node.ctx = ctx;
	        return node;
	    };

	    let getNewNode = () => {
	        if (!render) render = view;
	        let ret = render(data, ctx);
	        if (isFunction(ret)) {
	            render = ret;
	            return render(data, ctx);
	        } else {
	            return ret;
	        }
	    };

	    let initData = (obj = {}) => {
	        data = generateData(obj, ctx);
	        return data;
	    };

	    let getNode = () => node;

	    let getData = () => data;

	    let getCtx = () => ctx;

	    // TODO refator
	    let transferCtx = (newNode) => {
	        node = newNode;
	        newNode.ctx = ctx;
	    };

	    let ctx = {
	        update,
	        getNode,
	        getData,
	        transferCtx,
	        initData,
	        replaceView,
	        append,
	        getCtx
	    };

	    return ctx;
	};

	let generateData = (obj, ctx) => {
	    let data = null;
	    // data generator
	    if (isFunction(obj)) {
	        data = obj(ctx);
	    } else {
	        data = obj;
	    }

	    // TODO need mount event
	    if (!isObject(data)) {
	        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
	    }
	    return data;
	};

	module.exports = View;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    toArray
	} = __webpack_require__(21);

	let {
	    isNode
	} = __webpack_require__(9);

	let {
	    forEach
	} = __webpack_require__(16);

	let applyAttibutes = __webpack_require__(28);

	let replaceDirectly = (node, newNode) => {
	    let parent = node.parentNode;
	    if (parent) {
	        // replace
	        parent.replaceChild(newNode, node);
	        return newNode;
	    } else {
	        return node;
	    }
	};

	let removeOldNode = (oldNode) => {
	    let parent = oldNode.parentNode;
	    if (parent) {
	        parent.removeChild(oldNode);
	    }
	};

	// TODO using key
	let diffNode = (node, newNode) => {
	    if (!newNode) {
	        return removeOldNode(node);
	    }

	    if (node.nodeType === 3 && newNode.nodeType === 3) {
	        node.textContent = newNode.textContent;
	    }

	    if (isNode(node) && isNode(newNode)) {
	        if (node.nodeType === 3 && newNode.nodeType === 3) {
	            node.textContent = newNode.textContent;
	            return node;
	        }

	        if (node.tagName !== newNode.tagName ||
	            node.tagName === 'INPUT'
	        ) {
	            // TODO problems performance
	            // TODO nodetype problem
	            return replaceDirectly(node, newNode);
	        } else {
	            editNode(node, newNode);
	        }
	    }
	    return node;
	};

	let editNode = (node, newNode) => {
	    // attributes
	    applyAttibutes(node, newNode);
	    // transfer context
	    if (newNode.ctx) {
	        newNode.ctx.transferCtx(node);
	    }
	    let orinChildNodes = toArray(node.childNodes);
	    let newChildNodes = toArray(newNode.childNodes);

	    // TODO using key
	    convertLists(orinChildNodes, newChildNodes, node);
	};

	let convertLists = (orinChildNodes, newChildNodes, parent) => {
	    removeExtra(orinChildNodes, newChildNodes);

	    // diff
	    forEach(orinChildNodes, (orinChild, i) => {
	        diffNode(orinChild, newChildNodes[i]);
	    });

	    appendMissing(orinChildNodes, newChildNodes, parent);
	    return orinChildNodes;
	};

	let removeExtra = (orinChildNodes, newChildNodes) => {
	    // remove
	    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
	        removeOldNode(orinChildNodes[i]);
	    }
	};

	let appendMissing = (orinChildNodes, newChildNodes, parent) => {
	    // append
	    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
	        let newChild = newChildNodes[i];
	        parent.appendChild(newChild);
	    }
	};

	module.exports = (node, newNode) => {
	    let ret = null;

	    if (!node) {
	        ret = newNode;
	    } else if (!newNode) {
	        removeOldNode(node);
	        ret = null;
	    } else {
	        ret = diffNode(node, newNode);
	    }

	    return ret;
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getAttributeMap
	} = __webpack_require__(29);

	let {
	    hasOwnProperty
	} = __webpack_require__(21);

	let {
	    forEach
	} = __webpack_require__(16);

	let applyAttibutes = (node, newNode) => {
	    // attributes
	    let orinAttrMap = getAttributeMap(node.attributes);
	    let newAttrMap = getAttributeMap(newNode.attributes);

	    // update and remove
	    forEach(orinAttrMap, (orinValue, name) => {
	        if (hasOwnProperty(newAttrMap, name)) {
	            let newValue = newAttrMap[name];
	            if (newValue !== orinValue) {
	                node.setAttribute(name, newValue);
	            }
	        } else {
	            node.removeAttribute(name);
	        }
	    });

	    // append
	    forEach(newAttrMap, (newAttr, name) => {
	        if (!hasOwnProperty(orinAttrMap, name)) {
	            node.setAttribute(name, newAttr);
	        }
	    });
	};

	module.exports = applyAttibutes;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let shadowFrame = __webpack_require__(30);

	let startMomenter = __webpack_require__(31);

	let getX = (elem) => {
	    var x = 0;
	    while (elem) {
	        x = x + elem.offsetLeft;
	        elem = elem.offsetParent;
	    }
	    return x;
	};

	let getY = (elem) => {
	    var y = 0;
	    while (elem) {
	        y = y + elem.offsetTop;
	        elem = elem.offsetParent;
	    }
	    return y;
	};

	let getClientX = (elem) => {
	    return getX(elem) - window.scrollX;
	};

	let getClientY = (elem) => {
	    return getY(elem) - window.scrollY;
	};

	let removeChilds = (node) => {
	    while (node && node.firstChild) {
	        node.removeChild(node.firstChild);
	    }
	};

	let once = (node, type, handler, useCapture) => {
	    let fun = function(e) {
	        let ret = handler.apply(this, [e]);
	        node.removeEventListener(type, fun, useCapture);
	        return ret;
	    };

	    node.addEventListener(type, fun, useCapture);
	};

	let getAttributeMap = (attributes = []) => {
	    let map = {};
	    for (let i = 0; i < attributes.length; i++) {
	        let {
	            name, value
	        } = attributes[i];
	        map[name] = value;
	    }
	    return map;
	};

	let getClasses = (clz = '') => {
	    let ret = [];
	    let items = clz.split(' ');
	    for (let i = 0; i < items.length; i++) {
	        let item = items[i];
	        item = item.trim();
	        if (item) {
	            ret.push(item);
	        }
	    }
	    return ret;
	};

	module.exports = {
	    getX,
	    getY,
	    getClientX,
	    getClientY,
	    removeChilds,
	    once,
	    shadowFrame,
	    getAttributeMap,
	    startMomenter,
	    getClasses
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	let shadowFrame = () => {
	    let div = document.createElement('div');
	    let sr = div.createShadowRoot();
	    sr.innerHTML = '<div id="shadow-page"></div>';

	    let frame = null;

	    let create = () => {
	        let html = document.getElementsByTagName('html')[0];
	        html.appendChild(div);

	        return sr.getElementById('shadow-page');
	    };

	    let start = () => {
	        if (frame) {
	            return frame;
	        }
	        frame = new Promise(resolve => {
	            if (document.body) {
	                resolve(create());
	            } else {
	                document.addEventListener('DOMContentLoaded', () => {
	                    resolve(create());
	                });
	            }
	        });
	        return frame;
	    };

	    let close = () => {
	        frame.then(() => {
	            let parent = div.parentNode;
	            parent && parent.removeChild(div);
	        });
	    };

	    return {
	        start,
	        close,
	        sr,
	        rootDiv: div
	    };
	};

	module.exports = shadowFrame;


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	let isDomReady = (doc) => doc.readyState === 'complete' ||
	    (!doc.attachEvent && doc.readyState === 'interactive');

	let startMomenter = (doc = document) => {
	    let loadedFlag = false;

	    let resolves = [];

	    let docReady = () => {
	        let ready = () => {
	            if (loadedFlag) return;
	            loadedFlag = true;
	            for (let i = 0; i < resolves.length; i++) {
	                resolves[i]();
	            }
	            resolves = [];
	        };
	        if (doc.addEventListener) {
	            doc.addEventListener('DOMContentLoaded', ready);
	            doc.addEventListener('DOMContentLoaded', ready);
	        } else {
	            doc.attachEvent('onreadystatechange', () => {
	                if (document.readyState === 'complete') {
	                    ready();
	                }
	            });
	        }
	    };

	    docReady();

	    // generalWaitTime is used for async rendering
	    return ({
	        generalWaitTime = 0, startTimeout = 10000
	    } = {}) => new Promise((resolve, reject) => {
	        if (loadedFlag || isDomReady(doc)) { // already ready
	            setTimeout(resolve, generalWaitTime);
	        } else { // wait for ready
	            resolves.push(resolve);
	            setTimeout(() => {
	                reject(new Error('timeout'));
	            }, startTimeout);
	        }
	    });
	};

	module.exports = startMomenter;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    attachDocument
	} = __webpack_require__(14);

	let {
	    isNode
	} = __webpack_require__(9);

	let {
	    flat, forEach
	} = __webpack_require__(16);

	/**
	 * @param parentNode
	 *      the dom node used hook node we rendered
	 */
	module.exports = (kabaneryRoots, parentNode) => {
	    kabaneryRoots = flat(kabaneryRoots);
	    forEach(kabaneryRoots, (item) => {
	        if (isNode(item)) {
	            parentNode.appendChild(item);
	        }
	    });

	    // attach to document
	    attachDocument(getDoc(parentNode));
	};

	let getDoc = (node) => {
	    while (node.parentNode) {
	        node = node.parentNode;
	    }
	    return node;
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(6);

	let {
	    isArray, isFunction, isObject
	} = __webpack_require__(9);

	let {
	    map
	} = __webpack_require__(16);

	module.exports = (...args) => {
	    let tagName = args[0],
	        attrs = {},
	        childs = [];
	    if (isArray(args[1])) {
	        childs = args[1];
	    } else if (isFunction(args[1])) {
	        childs = [args[1]];
	    } else {
	        if (isObject(args[1])) {
	            attrs = args[1];
	            if (isArray(args[2])) {
	                childs = args[2];
	            } else if (isFunction(args[2])) {
	                childs = [args[2]];
	            }
	        }
	    }

	    return (...params) => {
	        let renderList = (list) => {
	            return map(list, (viewer) => {
	                if (isArray(viewer)) {
	                    return renderList(viewer);
	                } else if (isFunction(viewer)) {
	                    return viewer(...params);
	                } else {
	                    return viewer;
	                }
	            });
	        };

	        return n(tagName, attrs, renderList(childs));
	    };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getPredicateMetaInfo,
	    getPredicatePath,
	    infixTypes
	} = __webpack_require__(35);

	let {
	    get
	} = __webpack_require__(38);

	module.exports = ({
	    data,
	    onExpand,
	    onselected,

	    ExpandorView
	}) => {
	    let {
	        predicates
	    } = data;

	    let options = infixTypes({
	        predicates
	    });

	    return ExpandorView({
	        hide: data.hideExpressionExpandor,

	        options,

	        onExpand: (hide) => {
	            data.hideExpressionExpandor = hide;
	            data.infixPath = null;
	            onExpand && onExpand();
	        },

	        onselected: (v, path) => {
	            data.infixPath = path;
	            data.title = get(getPredicateMetaInfo(data.predicatesMetaInfo, getPredicatePath(path)), 'args.0.name');
	            data.hideExpressionExpandor = true;
	            onselected && onselected(v, path);
	        }
	    });
	};



/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    dsl, interpreter
	} = __webpack_require__(36);

	let {
	    PREDICATE, VARIABLE, JSON_DATA, ABSTRACTION, APPLICATION,
	    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, DEFAULT_DATA_MAP
	} = __webpack_require__(46);

	let {
	    reduce, get, forEach, map
	} = __webpack_require__(38);

	let {
	    isFunction, isObject
	} = __webpack_require__(9);

	let getLambdaUiValue = __webpack_require__(47);

	let {
	    v, r, method, getJson
	} = dsl;

	/**
	 * get lambda from lambda-ui value
	 *
	 * lambda ui value = {
	 *     path,
	 *
	 *     expression,    // for abstraction
	 *
	 *     currentVariables,    // for abstraction
	 *
	 *     params,    // predicate
	 *
	 *     value    // json data
	 * }
	 */

	let getLambda = (value) => {
	    let expressionType = getExpressionType(value.path);
	    let predicatePath = getPredicatePath(value.path);

	    switch (expressionType) {
	        case VARIABLE:
	            return v(getVariableName(value.path));
	        case ABSTRACTION:
	            if (value.expression === undefined) return new Error('expression is not defined in abstraction');
	            if (value.expression instanceof Error) return value.expression;
	            return r(...value.currentVariables, getLambda(value.expression));
	        case PREDICATE:
	            return method(predicatePath)(...map(value.params, getLambda));
	        case JSON_DATA:
	            return value.value;
	        case APPLICATION:
	            // TODO
	    }
	};

	let runner = (predicates) => {
	    let run = interpreter(predicates);

	    return (v) => {
	        let ret = getLambda(v);
	        if (ret instanceof Error) {
	            return ret;
	        }
	        try {
	            return run(getJson(ret));
	        } catch (err) {
	            return err;
	        }
	    };
	};

	let getVariableName = (path) => {
	    let parts = path.split('.');
	    parts.shift();
	    return parts.join('.');
	};

	let getExpressionType = (path = '') => {
	    return path.split('.')[0];
	};

	let getPredicatePath = (path = '') => path.split('.').slice(1).join('.');

	let expressionTypes = ({
	    predicates,
	    variables,
	    funs
	}) => {
	    let types = {
	        [JSON_DATA]: {
	            [NUMBER]: 1,
	            [BOOLEAN]: 1,
	            [STRING]: 1,
	            [JSON_TYPE]: 1,
	            [NULL]: 1
	        }, // declare json data
	        [PREDICATE]: predicates, // declare function
	        [ABSTRACTION]: 1, // declare function
	        [APPLICATION]: 1
	    };

	    if (variables.length) {
	        types.variable = reduce(variables, (prev, cur) => {
	            prev[cur] = 1;
	            return prev;
	        }, {});
	    }

	    return reduce(funs, (prev, name) => {
	        if (types[name]) {
	            prev[name] = types[name];
	        }
	        return prev;
	    }, {});
	};

	let infixTypes = ({
	    predicates
	}) => {
	    return {
	        [PREDICATE]: predicates
	    };
	};

	let getPredicateMetaInfo = (predicatesMetaInfo, predicatePath) => {
	    return get(predicatesMetaInfo, predicatePath) || {};
	};

	let getContext = ({
	    predicates,
	    predicatesMetaInfo,
	    variables,
	    funs,
	    pathMapping,
	    nameMap
	}) => {
	    return {
	        predicates,
	        predicatesMetaInfo,
	        variables,
	        funs,
	        pathMapping,
	        nameMap
	    };
	};

	let getDataTypePath = (path = '') => path.split('.').slice(1).join('.');

	let completeDataWithDefault = (data) => {
	    data.value = data.value || {};
	    data.value.currentVariables = data.value.variables || [];
	    data.variables = data.variables || [];
	    data.funs = data.funs || [JSON_DATA, PREDICATE, ABSTRACTION, VARIABLE];
	    data.onchange = data.onchange || id;
	    data.predicates = data.predicates || {};
	    data.predicatesMetaInfo = data.predicatesMetaInfo || {};

	    data.predicates.UI = {};
	    // add UI predicates
	    appendUIAsIds(data.predicates.UI, data.UI);

	    completePredicatesMetaInfo(data.predicates, data.predicatesMetaInfo);

	    // predicate meta info viewer
	    transitionPredicateMetaViewer(data.predicates, data.predicatesMetaInfo);

	    // make title
	    let expresionType = getExpressionType(data.value.path);
	    if (expresionType === PREDICATE) {
	        let predicatePath = getPredicatePath(data.value.path);
	        let {
	            title
	        } = getPredicateMetaInfo(data.predicatesMetaInfo, predicatePath) || {};
	        if (title) {
	            data.title = title;
	        }
	    }

	    return data;
	};

	let transitionPredicateMetaViewer = (predicates, predicatesMetaInfo) => {
	    forEach(predicates, (v, name) => {
	        let meta = predicatesMetaInfo[name];
	        if (isFunction(v)) {
	            forEach(meta.args, (item) => {
	                if (item && item.viewer) {
	                    let viewer = item.viewer;
	                    item.viewer = (_) => viewer(_, item);
	                }
	            });
	        } else if (isObject(v)) {
	            transitionPredicateMetaViewer(v, meta);
	        }
	    });
	};

	let appendUIAsIds = (predicates, UI = {}) => {
	    forEach(UI, (v, name) => {
	        if (isFunction(v)) {
	            predicates[name] = id;
	        } else if (isObject(v)) {
	            predicates[name] = {};
	            appendUIAsIds(v, predicates[name]);
	        }
	    });
	};

	let completePredicatesMetaInfo = (predicates, predicatesMetaInfo) => {
	    forEach(predicates, (v, name) => {
	        if (isFunction(v) && v.meta) {
	            predicatesMetaInfo[name] = predicatesMetaInfo[name] || v.meta;
	        }

	        predicatesMetaInfo[name] = predicatesMetaInfo[name] || {};
	        predicatesMetaInfo[name].args = predicatesMetaInfo[name].args || [];
	        if (isFunction(v)) {
	            forEach(new Array(v.length), (_, index) => {
	                predicatesMetaInfo[name].args[index] = predicatesMetaInfo[name].args[index] || {};
	            });
	        } else if (v && isObject(v)) {
	            completePredicatesMetaInfo(v, predicatesMetaInfo[name]);
	        }
	    });
	};

	let completeValueWithDefault = (value) => {
	    let expresionType = getExpressionType(value.path);
	    if (expresionType === JSON_DATA) {
	        let type = getDataTypePath(value.path);
	        value.value = value.value === undefined ? DEFAULT_DATA_MAP[type] : value.value;
	    } else if (expresionType === PREDICATE) {
	        value.params = value.params || [];
	        value.infix = value.infix || 0;
	    }
	    return value;
	};

	let isUIPredicate = (path) => {
	    return /^predicate\.UI\./.test(path);
	};

	let getUIPredicatePath = (path) => {
	    let ret = path.match(/^predicate\.UI\.(.*)$/);
	    return ret && ret[1];
	};

	let id = v => v;

	module.exports = {
	    completeDataWithDefault,
	    getLambda,
	    runner,
	    getExpressionType,
	    getPredicatePath,
	    getVariableName,
	    expressionTypes,
	    infixTypes,
	    getPredicateMetaInfo,
	    getContext,
	    getDataTypePath,
	    completeValueWithDefault,

	    getLambdaUiValue,

	    isUIPredicate,
	    getUIPredicatePath
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * ח calculus
	 *
	 * e ::=    x       a variable
	 *   |      חx.e    an abstracton (function)
	 *   |      e₁e₂    a (function) application
	 *
	 *
	 * using lambda to transfer data
	 *  1. using apis to construct a lambda
	 *  2. translate lambda to json
	 *  3. sending json
	 *  4. accept json and execute lambda
	 *
	 *
	 *
	 * language: (P, ח, J)
	 *
	 *  1. J meta data set. The format of meta data is json
	 *  2. P: predicate set
	 *
	 * eg: חx.add(x, 1)
	 *      meta data: 1
	 *      variable: x
	 *      predicate: add
	 */

	let dsl = __webpack_require__(37);
	let interpreter = __webpack_require__(41);

	module.exports = {
	    dsl,
	    interpreter
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * dsl used to contruct lambda json
	 *
	 * ח based on predicates and json expansion
	 *
	 * e ::= json                    as meta data, also a pre-defined π expression
	 *   |   x                       variable
	 *   |   predicate               predicate is a pre-defined abstraction
	 *   |   חx.e                    abstraction
	 *   |   e1e2                    application
	 *
	 * ## translate lambda to json
	 *
	 * 1. meta data
	 *
	 *  j ←→ ['d', j]
	 *
	 * 2. predicate
	 *
	 *  f(x, y, z) ←→ ['p', 'f', [t(x), t(y), t(z)]]
	 *
	 * 3. variable
	 *
	 *  x ←→ ['v', 'x']
	 *
	 * 4. abstraction
	 *
	 *  חx₁x₂...x.e ←→ ['l', ['x₁', 'x₂', ...], t(e)]
	 *
	 * 5. an application
	 *
	 *  e₁e₂e₃... ←→ ['a', [t(e₁), t(e₂), ...]]
	 *
	 * ## usage
	 *
	 * 1. import predicate set
	 *
	 * let add = c.require('add');
	 * let sub = c.require('sub');
	 *
	 * 2. construct lambda
	 *
	 *  - meta
	 *
	 *    just itself
	 *
	 *    e = j
	 *
	 *  - varibale
	 *
	 *    e = c.v('x')
	 *
	 *  - predicate
	 *
	 *    e = add(1, c.v('x'))
	 *
	 *  - abstraction
	 *
	 *    e = c.r(['x'], add(1, c.v('x'))
	 *
	 *  - an application
	 *
	 *    e = e₁(e₂)
	 *
	 *  expression = () => expression
	 *  expression.json
	 */

	let {
	    map, contain
	} = __webpack_require__(38);

	let {
	    isFunction, likeArray, funType
	} = __webpack_require__(9);

	let unique = {};

	const EXPRESSION_PREFIXES = ['a', 'p', 'f', 'v', 'd', 'l'];
	const [
	    APPLICATION_PREFIX,
	    PREDICATE_PREFIX,
	    PREDICATE_VARIABLE_PREFIX,
	    VARIABLE_PREFIX,
	    META_DATA_PREFIX,
	    ABSTRACTION_PREFIX
	] = EXPRESSION_PREFIXES;

	/**
	 * get expression
	 */
	let exp = (json) => {
	    // application
	    let e = (...args) => {
	        return exp([APPLICATION_PREFIX, getJson(e), map(args, getJson)]);
	    };
	    e.unique = unique;
	    e.json = json;
	    return e;
	};

	/**
	 * import predicate
	 */
	let requirePredicate = (...args) => {
	    if (args.length > 1) {
	        return map(args, genPredicate);
	    } else {
	        return genPredicate(args[0]);
	    }
	};

	let genPredicate = (name = '') => {
	    let predicate = (...args) => {
	        /**
	         * predicate
	         */
	        return exp([PREDICATE_PREFIX, name.trim(), map(args, getJson)]);
	    };
	    predicate.unique = unique;
	    predicate.json = [PREDICATE_VARIABLE_PREFIX, name];

	    return predicate;

	};

	/**
	 * define variable
	 *
	 * TODO type
	 */
	let v = (name) => exp([VARIABLE_PREFIX, name]);

	/**
	 * e → חx₁x₂...x . e
	 */
	let r = (...args) => exp([ABSTRACTION_PREFIX, args.slice(0, args.length - 1), getJson(args[args.length - 1])]);

	let isExp = v => isFunction(v) && v.unique === unique;

	let getJson = (e) => isExp(e) ? e.json : [META_DATA_PREFIX, e];

	let getExpressionType = funType((json) => {
	    let type = json[0];
	    if (!contain(EXPRESSION_PREFIXES, type)) {
	        throw new Error(`unexpected expression type ${json[0]}. The context json is ${JSON.stringify(json, null, 4)}`);
	    }
	    return type;
	}, [likeArray]);

	let destruct = (json) => {
	    let type = getExpressionType(json);

	    switch (type) {
	        case META_DATA_PREFIX:
	            return {
	                type,
	                metaData: json[1]
	            };
	        case VARIABLE_PREFIX:
	            return {
	                type,
	                variableName: json[1]
	            };
	        case ABSTRACTION_PREFIX:
	            return {
	                abstractionArgs: json[1],
	                abstractionBody: json[2],
	                type,
	            };
	        case PREDICATE_PREFIX:
	            return {
	                predicateName: json[1],
	                predicateParams: json[2],
	                type,
	            };
	        case APPLICATION_PREFIX:
	            return {
	                applicationFun: json[1],
	                applicationParams: json[2],
	                type
	            };
	        case PREDICATE_VARIABLE_PREFIX:
	            return {
	                type,
	                predicateName: json[1]
	            };
	    }
	};

	module.exports = {
	    require: requirePredicate,
	    method: requirePredicate,
	    r,
	    v,
	    getJson,

	    getExpressionType,

	    APPLICATION_PREFIX,
	    PREDICATE_PREFIX,
	    PREDICATE_VARIABLE_PREFIX,
	    VARIABLE_PREFIX,
	    META_DATA_PREFIX,
	    ABSTRACTION_PREFIX,

	    EXPRESSION_PREFIXES,

	    destruct
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(39);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
	} = __webpack_require__(40);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact,
	    reverse,
	    overArgs
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(9);

	/**
	 * @param opts
	 *      preidcate: chose items to iterate
	 *      limit: when to stop iteration
	 *      transfer: transfer item
	 *      output
	 *      def: default result
	 */
	let iterate = funType((domain, opts = {}) => {
	    domain = domain || [];
	    if (isPromise(domain)) {
	        return domain.then(list => {
	            return iterate(list, opts);
	        });
	    }
	    return iterateList(domain, opts);
	}, [
	    or(isPromise, isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateList = (domain, opts) => {
	    opts = initOpts(opts, domain);

	    let rets = opts.def;
	    let count = 0; // iteration times

	    if (isReadableStream(domain)) {
	        let index = -1;

	        return new Promise((resolve, reject) => {
	            domain.on('data', (chunk) => {
	                // TODO try cache error
	                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
	                rets = itemRet.rets;
	                count = itemRet.count;
	                if (itemRet.stop) {
	                    resolve(rets);
	                }
	            });
	            domain.on('end', () => {
	                resolve(rets);
	            });
	            domain.on('error', (err) => {
	                reject(err);
	            });
	        });
	    } else if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let item = domain[i];
	            let itemRet = iterateItem(item, domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let item = domain[name];
	            let itemRet = iterateItem(item, domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	};

	let initOpts = (opts, domain) => {
	    let {
	        predicate, transfer, output, limit
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);
	    return opts;
	};

	let iterateItem = (item, domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = {
	    iterate
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(39);

	let {
	    isFunction
	} = __webpack_require__(9);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = isFunction(item) ? item : (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let reverse = (list) => reduce(list, (prev, cur) => {
	    prev.unshift(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	let overArgs = (func, transform) => {
	    return (...args) => {
	        let newArgs = transform(...args);
	        return func(...newArgs);
	    };
	};

	module.exports = {
	    overArgs,
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact,
	    reverse
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    map, reduce
	} = __webpack_require__(38);

	let {
	    funType, isObject, isFunction
	} = __webpack_require__(9);

	let {
	    hasOwnProperty, get
	} = __webpack_require__(42);

	let {
	    APPLICATION_PREFIX,
	    PREDICATE_PREFIX,
	    PREDICATE_VARIABLE_PREFIX,
	    VARIABLE_PREFIX,
	    META_DATA_PREFIX,
	    ABSTRACTION_PREFIX,

	    destruct
	} = __webpack_require__(37);

	/**
	 * used to interpret lambda json
	 *
	 * TODO
	 *
	 * basic operation:
	 *  - α conversion (renaming) חx.e ←→ חy.[y/x]e
	 *  - β reduction (application) (חx.e₁)e₂ → [e₂/x]e₁
	 *  - Ŋ reduction     חx.ex → e
	 */

	/**
	 * d: meta data
	 * v: variable
	 * l: abstraction
	 * p: predicate
	 * a: application
	 * f: predicate as variable
	 *
	 * TODO
	 *
	 * 1. name capture
	 * 2. reduce
	 *
	 * @param predicateSet Object
	 *  a map of predicates
	 */

	module.exports = (predicateSet) => {
	    return (data) => {
	        // TODO check data format
	        let translate = funType((json, ctx) => {
	            let translateWithCtx = (data) => translate(data, ctx);

	            let error = (msg) => {
	                throw new Error(msg + ' . Context json is ' + JSON.stringify(json));
	            };

	            let {
	                type,
	                metaData,

	                variableName,

	                predicateName,
	                predicateParams,

	                abstractionArgs,
	                abstractionBody,

	                applicationFun,
	                applicationParams
	            } = destruct(json);

	            switch (type) {
	                case META_DATA_PREFIX: // meta data
	                    return metaData;

	                case VARIABLE_PREFIX: // variable
	                    var context = ctx;
	                    while (context) {
	                        if (hasOwnProperty(context.curVars, variableName)) {
	                            return context.curVars[variableName];
	                        }
	                        context = context.parentCtx;
	                    }

	                    return error(`undefined variable ${variableName}`);

	                case ABSTRACTION_PREFIX: // abstraction
	                    return (...args) => {
	                        // update variable map
	                        return translate(abstractionBody, {
	                            curVars: reduce(abstractionArgs, (prev, name, index) => {
	                                prev[name] = args[index];
	                                return prev;
	                            }, {}),
	                            parentCtx: ctx
	                        });
	                    };

	                case PREDICATE_PREFIX: // predicate
	                    var predicate = get(predicateSet, predicateName);
	                    if (!isFunction(predicate)) {
	                        return error(`missing predicate ${predicateName}`);
	                    }
	                    return predicate(...map(predicateParams, translateWithCtx));

	                case APPLICATION_PREFIX: // application
	                    var abstraction = translateWithCtx(applicationFun);
	                    if (!isFunction(abstraction)) {
	                        return error(`expected function, but got ${fun} from ${applicationFun}.`);
	                    }
	                    return abstraction(...map(applicationParams, translateWithCtx));

	                case PREDICATE_VARIABLE_PREFIX: // predicate as a variable
	                    var fun = get(predicateSet, predicateName);
	                    if (!isFunction(fun)) {
	                        return error(`missing predicate ${predicateName}`);
	                    }
	                    return fun;
	            }
	        }, [
	            isObject, isObject
	        ]);

	        return translate(data, {
	            curVars: {}
	        });
	    };
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(43);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(9);

	let defineProperty = (obj, key, opts) => {
	    if (Object.defineProperty) {
	        Object.defineProperty(obj, key, opts);
	    } else {
	        obj[key] = opts.value;
	    }
	    return obj;
	};

	let hasOwnProperty = (obj, key) => {
	    if (obj.hasOwnProperty) {
	        return obj.hasOwnProperty(key);
	    }
	    for (var name in obj) {
	        if (name === key) return true;
	    }
	    return false;
	};

	let toArray = (v = []) => Array.prototype.slice.call(v);

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let set = (sandbox, name = '', value) => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    let parent = sandbox;
	    if (!isObject(parent)) return;
	    if (!parts.length) return;
	    for (let i = 0; i < parts.length - 1; i++) {
	        let part = parts[i];
	        let next = parent[part];
	        if (!isObject(next)) {
	            next = {};
	            parent[part] = next;
	        }
	        parent = next;
	    }

	    parent[parts[parts.length - 1]] = value;
	    return sandbox;
	};

	/**
	 * provide property:
	 *
	 * 1. read props freely
	 *
	 * 2. change props by provide token
	 */

	let authProp = (token) => {
	    let set = (obj, key, value) => {
	        let temp = null;

	        if (!hasOwnProperty(obj, key)) {
	            defineProperty(obj, key, {
	                enumerable: false,
	                configurable: false,
	                set: (value) => {
	                    if (isObject(value)) {
	                        if (value.token === token) {
	                            // save
	                            temp = value.value;
	                        }
	                    }
	                },
	                get: () => {
	                    return temp;
	                }
	            });
	        }

	        setProp(obj, key, value);
	    };

	    let setProp = (obj, key, value) => {
	        obj[key] = {
	            token,
	            value
	        };
	    };

	    return {
	        set
	    };
	};

	let evalCode = (code) => {
	    if (typeof code !== 'string') return code;
	    return eval(`(function(){
	    try {
	        ${code}
	    } catch(err) {
	        console.log('Error happened, when eval code.');
	        throw err;
	    }
	})()`);
	};

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let runSequence = (list, params = [], context, stopV) => {
	    if (!list.length) {
	        return Promise.resolve();
	    }
	    let fun = list[0];
	    try {
	        let v = fun && fun.apply(context, params);

	        if (stopV && v === stopV) {
	            return Promise.resolve(stopV);
	        }
	        return Promise.resolve(v).then(() => {
	            return runSequence(list.slice(1), params, context, stopV);
	        });
	    } catch (err) {
	        return Promise.reject(err);
	    }
	};

	module.exports = {
	    defineProperty,
	    hasOwnProperty,
	    toArray,
	    get,
	    set,
	    authProp,
	    evalCode,
	    delay,
	    runSequence
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(44);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(45);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(44);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	// expression type
	const EXPRESSION_TYPES = ['variable', 'data', 'abstraction', 'predicate'];

	const [VARIABLE, JSON_DATA, ABSTRACTION, PREDICATE] = EXPRESSION_TYPES;

	const DATA_TYPES = ['number', 'boolean', 'string', 'json', 'null'];

	const [NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL] = DATA_TYPES;

	const INLINE_TYPES = [NUMBER, BOOLEAN, STRING, NULL];

	const DEFAULT_DATA_MAP = {
	    [NUMBER]: 0,
	    [BOOLEAN]: true,
	    [STRING]: '',
	    [JSON_TYPE]: {},
	    [NULL]: null
	};

	module.exports = {
	    EXPRESSION_TYPES,
	    VARIABLE,
	    JSON_DATA,
	    ABSTRACTION,
	    PREDICATE,

	    DATA_TYPES,
	    NUMBER,
	    BOOLEAN,
	    STRING,
	    JSON_TYPE,
	    NULL,
	    INLINE_TYPES,

	    DEFAULT_DATA_MAP
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    dsl
	} = __webpack_require__(36);

	let {
	    destruct,

	    APPLICATION_PREFIX,
	    PREDICATE_PREFIX,
	    PREDICATE_VARIABLE_PREFIX,
	    VARIABLE_PREFIX,
	    META_DATA_PREFIX,
	    ABSTRACTION_PREFIX
	} = dsl;

	let {
	    JSON_DATA,
	    VARIABLE,
	    ABSTRACTION,
	    PREDICATE,

	    NUMBER,
	    BOOLEAN,
	    STRING,
	    NULL,
	    JSON_TYPE
	} = __webpack_require__(46);

	let {
	    compact, map
	} = __webpack_require__(38);

	let {
	    isString, isNumber, isBool, isNull, isObject
	} = __webpack_require__(9);

	/**
	 * lambda ui value = {
	 *     path,
	 *
	 *     expression,    // for abstraction
	 *
	 *     variables,    // for abstraction
	 *
	 *     params,    // predicate
	 *
	 *     value    // json data
	 * }
	 */

	let getLambdaUiValue = (lambdaJson) => {
	    let {
	        type,
	        metaData,

	        variableName,

	        abstractionArgs,
	        abstractionBody,

	        predicateName,
	        predicateParams
	    } = destruct(lambdaJson);

	    switch (type) {
	        case META_DATA_PREFIX:
	            return {
	                path: compact([JSON_DATA, getMetaType(metaData)]).join('.'),
	                value: metaData
	            };
	        case VARIABLE_PREFIX:
	            return {
	                path: [VARIABLE, variableName].join('.')
	            };
	        case ABSTRACTION_PREFIX:
	            return {
	                path: ABSTRACTION,
	                expression: getLambdaUiValue(abstractionBody),
	                variables: abstractionArgs
	            };
	        case PREDICATE_PREFIX:
	            return {
	                path: compact([PREDICATE, predicateName]).join('.'),
	                params: map(predicateParams, getLambdaUiValue)
	            };
	        case APPLICATION_PREFIX:
	            // TODO
	            break;
	        case PREDICATE_VARIABLE_PREFIX:
	            // TODO
	            break;
	    }
	};

	let getMetaType = (data) => {
	    if (isString(data)) return STRING;

	    else if (isNumber(data)) return NUMBER;

	    else if (isBool(data)) return BOOLEAN;

	    else if (isNull(data)) return NULL;

	    else if (isObject(data)) return JSON_TYPE;
	};

	module.exports = getLambdaUiValue;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	let {
	    mergeMap
	} = __webpack_require__(38);

	let {
	    isFunction
	} = __webpack_require__(9);

	let TreeSelect = __webpack_require__(49);

	let triangle = __webpack_require__(60);

	let {
	    PREDICATE, VARIABLE
	} = __webpack_require__(46);

	const DEFAULT_TITLE = 'please select';

	module.exports = view(({
	    path,
	    data,
	    showSelectTree,
	    onselected,
	    title,
	    guideLine,
	    nameMap
	}, {
	    update
	}) => {
	    return n('label', {
	        style: {
	            color: '#9b9b9b',
	            fontSize: 12,
	            position: 'relative',
	            display: 'inline-block'
	        }
	    }, [
	        path && title && n('div', {
	            style: {
	                fontSize: 14
	            }
	        }, title),

	        n('div', {
	            style: {
	                paddingRight: 8,
	                cursor: 'pointer',
	                backgroundColor: showSelectTree ? 'rgba(200, 200, 200, .12)' : 'none'
	            },

	            'class': 'lambda-ui-hover',

	            onclick: () => {
	                update('showSelectTree', !showSelectTree);
	            }
	        }, path ? (guideLine === false ? null : (!guideLine ? renderGuideLine(path) : guideLine)) : n('div class="input-style"', {
	            style: {
	                color: '#9b9b9b',
	                overflow: 'auto'
	            }
	        }, [
	            n('span', {
	                style: {
	                    fontSize: 12
	                }
	            }, title || DEFAULT_TITLE),

	            n('div', {
	                style: mergeMap(triangle({
	                    direction: 'down',
	                    top: 5,
	                    left: 5,
	                    right: 5,
	                    color: '#737373'
	                }), {
	                    display: 'inline-block',
	                    'float': 'right',
	                    position: 'relative',
	                    top: 5
	                })
	            })
	        ])),

	        n('div', {
	            style: {
	                position: 'absolute',
	                backgroundColor: 'white',
	                zIndex: 10000,
	                fontSize: 14
	            }
	        }, [
	            showSelectTree && data && TreeSelect({
	                data: isFunction(data) ? data() : data,
	                onselected: (v, p) => {
	                    onselected && onselected(v, p);
	                    update([
	                        ['path', p],
	                        ['showSelectTree', false]
	                    ]);
	                },
	                nameMap
	            })
	        ])
	    ]);
	});

	/**
	 * @param path string
	 */
	let renderGuideLine = (path) => {
	    let parts = path.split('.');
	    let last = parts.pop();
	    let type = parts[0];

	    return n('span', [
	        n('span', {
	            style: {
	                fontWeight: (type === PREDICATE || type === VARIABLE) ? 'bold' : 'inherit',
	                fontSize: 12,
	                color: '#b4881d',
	                padding: '0 5px'
	            }
	        }, last),

	        (type === PREDICATE || type === VARIABLE) && parts.length && n('span', {
	            style: {
	                paddingLeft: 10
	            }
	        }, `(${parts.join(' > ')})`)
	    ]);
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	let {
	    map, compact, mergeMap
	} = __webpack_require__(38);

	let {
	    isObject
	} = __webpack_require__(9);

	let {
	    getWindowWidth, getWindowHeight
	} = __webpack_require__(50);

	let {
	    hasOwnProperty
	} = __webpack_require__(53);

	let idgener = __webpack_require__(57);

	let triangle = __webpack_require__(59);

	/**
	 * @param data Object
	 *  data is a normal js object without circle
	 */

	let renderMap = view(({
	    data,
	    hidden,
	    onselected,
	    targetPosition,
	    maxShowItemNum = 10, selectedPath = '', parentPath = '', nameMap = {}
	}, {
	    update
	}) => {
	    let selectedName = selectedPath.split('.')[0];
	    let restPath = selectedPath.substring(selectedName.length + 1);
	    let itemWidth = 164,
	        itemHeight = 16;
	    if (hidden) return null;

	    let expandedItem = (item, name) => {
	        let left = 0,
	            top = 0,
	            windowWidth = getWindowWidth(),
	            windowHeight = getWindowHeight();

	        if (targetPosition) {
	            left = targetPosition.left - left + itemWidth;
	            top = targetPosition.top + top;
	            if (targetPosition.right + itemWidth > windowWidth) {
	                // show in left
	                left = left - 2 * itemWidth;

	                if (targetPosition.left - itemWidth < 0) {
	                    left = targetPosition.left + 10;
	                }
	            }
	            let h = itemHeight * Object.keys(item).length;
	            if (targetPosition.bottom + h > windowHeight) {
	                // show in top
	                top = Math.max(top - h, 10);
	            }
	        }

	        return n('div', {
	            style: {
	                position: targetPosition ? 'fixed' : 'relative',
	                left,
	                top,
	                zIndex: 1000
	            }
	        }, renderMap({
	            data: item,
	            selectedPath: restPath,
	            onselected,
	            parentPath: getPath(name, parentPath),
	            nameMap
	        }));
	    };

	    return n('ul', {
	        style: {
	            width: itemWidth,
	            maxHeight: maxShowItemNum * itemHeight,
	            overflow: 'scroll',
	            'display': 'inline-block',
	            'margin': 0,
	            'padding': '3 0',
	            border: '1px solid rgba(80, 80, 80, 0.3)',
	            borderRadius: 4,
	            boxShadow: '0px 0px 2px #888888',
	            backgroundColor: 'rgba(244, 244, 244, 0.95)'
	        }
	    }, map(data, (item, name) => {
	        return n('li', {
	            style: {
	                position: 'relative',
	                listStyle: 'none',
	                cursor: 'pointer',
	                minWidth: 100,
	                padding: '5 10',
	                backgroundColor: name === selectedName ? '#3879d9' : 'none',
	                color: name === selectedName ? 'white' : 'black'
	            },

	            'class': SELECT_ITEM_HOVER_CLASS,

	            onclick: () => {
	                update('hidden', true);
	            }
	        }, [
	            n('div', {
	                style: {
	                    height: 16,
	                    lineHeight: 16
	                }
	            }, [
	                n('div', {
	                    style: {
	                        'float': 'left',
	                        position: 'relative',
	                        width: '95%',
	                        textOverflow: 'ellipsis',
	                        overflow: 'hidden'
	                    }
	                }, [
	                    n('span', hasOwnProperty(nameMap, getPath(name, parentPath)) ? nameMap[getPath(name, parentPath)] : name)
	                ]),

	                isObject(item) && [
	                    n('div', {
	                        style: {
	                            'float': 'right',
	                            position: 'relative',
	                            width: '5%',
	                            height: itemHeight
	                        }
	                    }, [
	                        n('div', {
	                            style: mergeMap({
	                                position: 'relative',
	                                top: (itemHeight - 10) / 2
	                            }, triangle({
	                                direction: 'right',
	                                top: 5,
	                                bottom: 5,
	                                left: 10
	                            }))
	                        }),
	                        name === selectedName && expandedItem(item, name),
	                    ])
	                ],
	                n('div', {
	                    style: {
	                        clear: 'both'
	                    }
	                })
	            ]),

	            n('div', {
	                style: {
	                    position: 'absolute',
	                    width: '100%',
	                    height: '100%',
	                    left: 0,
	                    top: 0
	                },

	                onclick: (e) => {
	                    if (isObject(item)) {
	                        e.stopPropagation();
	                        // expand it
	                        update([
	                            ['selectedPath', name === selectedName ? '' : name],
	                            ['targetPosition', e.target.getBoundingClientRect()]
	                        ]);
	                    } else {
	                        onselected && onselected(item, getPath(name, parentPath));
	                        update('hidden', true);
	                    }
	                }
	            })
	        ]);
	    }));
	});

	let getPath = (name, parentPath) => {
	    return compact([parentPath, name]).join('.');
	};

	const SELECT_ITEM_HOVER_CLASS = 'select-item-' + idgener().replace(/\./g, '-');

	module.exports = (data) => {
	    document.getElementsByTagName('head')[0].appendChild(n('style', {
	        type: 'text/css'
	    }, `.${SELECT_ITEM_HOVER_CLASS}:hover{background-color: #118bfb}`));

	    return renderMap(data);
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let shadowFrame = __webpack_require__(51);

	let startMomenter = __webpack_require__(52);

	let getX = (elem) => {
	    var x = 0;
	    while (elem) {
	        x = x + elem.offsetLeft;
	        elem = elem.offsetParent;
	    }
	    return x;
	};

	let getY = (elem) => {
	    var y = 0;
	    while (elem) {
	        y = y + elem.offsetTop;
	        elem = elem.offsetParent;
	    }
	    return y;
	};

	let getClientX = (elem) => {
	    return getX(elem) - window.scrollX;
	};

	let getClientY = (elem) => {
	    return getY(elem) - window.scrollY;
	};

	let removeChilds = (node) => {
	    while (node && node.firstChild) {
	        node.removeChild(node.firstChild);
	    }
	};

	let once = (node, type, handler, useCapture) => {
	    let fun = function(e) {
	        let ret = handler.apply(this, [e]);
	        node.removeEventListener(type, fun, useCapture);
	        return ret;
	    };

	    node.addEventListener(type, fun, useCapture);
	};

	let getAttributeMap = (attributes = []) => {
	    let map = {};
	    for (let i = 0; i < attributes.length; i++) {
	        let {
	            name, value
	        } = attributes[i];
	        map[name] = value;
	    }
	    return map;
	};

	let getClasses = (clz = '') => {
	    let ret = [];
	    let items = clz.split(' ');
	    for (let i = 0; i < items.length; i++) {
	        let item = items[i];
	        item = item.trim();
	        if (item) {
	            ret.push(item);
	        }
	    }
	    return ret;
	};

	let isMobile = () => {
	    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	        return true;
	    }
	    return false;
	};

	let getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	let getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	module.exports = {
	    getX,
	    getY,
	    getClientX,
	    getClientY,
	    getWindowWidth,
	    getWindowHeight,
	    removeChilds,
	    once,
	    shadowFrame,
	    getAttributeMap,
	    startMomenter,
	    getClasses,
	    isMobile
	};


/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';

	let shadowFrame = () => {
	    let div = document.createElement('div');
	    let sr = div.createShadowRoot();
	    sr.innerHTML = '<div id="shadow-page"></div>';

	    let frame = null;

	    let create = () => {
	        let html = document.getElementsByTagName('html')[0];
	        html.appendChild(div);

	        return sr.getElementById('shadow-page');
	    };

	    let start = () => {
	        if (frame) {
	            return frame;
	        }
	        frame = new Promise(resolve => {
	            if (document.body) {
	                resolve(create());
	            } else {
	                document.addEventListener('DOMContentLoaded', () => {
	                    resolve(create());
	                });
	            }
	        });
	        return frame;
	    };

	    let close = () => {
	        frame.then(() => {
	            let parent = div.parentNode;
	            parent && parent.removeChild(div);
	        });
	    };

	    return {
	        start,
	        close,
	        sr,
	        rootDiv: div
	    };
	};

	module.exports = shadowFrame;


/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';

	let isDomReady = (doc) => doc.readyState === 'complete' ||
	    (!doc.attachEvent && doc.readyState === 'interactive');

	let startMomenter = (doc = document) => {
	    let loadedFlag = false;

	    let resolves = [];

	    let docReady = () => {
	        let ready = () => {
	            window.removeEventListener('load', ready, false);
	            doc.removeEventListener('DOMContentLoaded', ready, false);

	            if (loadedFlag) return;
	            loadedFlag = true;
	            for (let i = 0; i < resolves.length; i++) {
	                resolves[i]();
	            }
	            resolves = [];
	        };

	        doc.addEventListener('DOMContentLoaded', ready, false);
	        window.addEventListener('load', ready, false);
	    };

	    docReady();

	    // generalWaitTime is used for async rendering
	    return ({
	        generalWaitTime = 0, startTimeout = 10000
	    } = {}) => new Promise((resolve, reject) => {
	        if (loadedFlag || isDomReady(doc)) { // already ready
	            setTimeout(resolve, generalWaitTime);
	        } else { // wait for ready
	            resolves.push(resolve);
	            setTimeout(() => {
	                reject(new Error('timeout'));
	            }, startTimeout);
	        }
	    });
	};

	module.exports = startMomenter;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(54);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(9);

	let defineProperty = (obj, key, opts) => {
	    if (Object.defineProperty) {
	        Object.defineProperty(obj, key, opts);
	    } else {
	        obj[key] = opts.value;
	    }
	    return obj;
	};

	let hasOwnProperty = (obj, key) => {
	    if (obj.hasOwnProperty) {
	        return obj.hasOwnProperty(key);
	    }
	    for (var name in obj) {
	        if (name === key) return true;
	    }
	    return false;
	};

	let toArray = (v = []) => Array.prototype.slice.call(v);

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let set = (sandbox, name = '', value) => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    let parent = sandbox;
	    if (!isObject(parent)) return;
	    if (!parts.length) return;
	    for (let i = 0; i < parts.length - 1; i++) {
	        let part = parts[i];
	        let next = parent[part];
	        if (!isObject(next)) {
	            next = {};
	            parent[part] = next;
	        }
	        parent = next;
	    }

	    parent[parts[parts.length - 1]] = value;
	    return sandbox;
	};

	/**
	 * provide property:
	 *
	 * 1. read props freely
	 *
	 * 2. change props by provide token
	 */

	let authProp = (token) => {
	    let set = (obj, key, value) => {
	        let temp = null;

	        if (!hasOwnProperty(obj, key)) {
	            defineProperty(obj, key, {
	                enumerable: false,
	                configurable: false,
	                set: (value) => {
	                    if (isObject(value)) {
	                        if (value.token === token) {
	                            // save
	                            temp = value.value;
	                        }
	                    }
	                },
	                get: () => {
	                    return temp;
	                }
	            });
	        }

	        setProp(obj, key, value);
	    };

	    let setProp = (obj, key, value) => {
	        obj[key] = {
	            token,
	            value
	        };
	    };

	    return {
	        set
	    };
	};

	let evalCode = (code) => {
	    if (typeof code !== 'string') return code;
	    return eval(`(function(){
	    try {
	        ${code}
	    } catch(err) {
	        console.log('Error happened, when eval code.');
	        throw err;
	    }
	})()`);
	};

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let runSequence = (list, params = [], context, stopV) => {
	    if (!list.length) {
	        return Promise.resolve();
	    }
	    let fun = list[0];
	    try {
	        let v = fun && fun.apply(context, params);

	        if (stopV && v === stopV) {
	            return Promise.resolve(stopV);
	        }
	        return Promise.resolve(v).then(() => {
	            return runSequence(list.slice(1), params, context, stopV);
	        });
	    } catch (err) {
	        return Promise.reject(err);
	    }
	};

	module.exports = {
	    defineProperty,
	    hasOwnProperty,
	    toArray,
	    get,
	    set,
	    authProp,
	    evalCode,
	    delay,
	    runSequence
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(55);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(56);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(55);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(58);


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';

	let count = 0;

	module.exports = ({
	    timeVisual = false
	} = {}) => {
	    count++;
	    if (count > 10e6) {
	        count = 0;
	    }
	    let rand = Math.random(Math.random()) + '';

	    let time = timeVisual ? getTimeStr() : new Date().getTime();

	    return `${time}-${count}-${rand}`;
	};

	let getTimeStr = () => {
	    let date = new Date();
	    let month = completeWithZero(date.getMonth() + 1, 2);
	    let dat = completeWithZero(date.getDate(), 2);
	    let hour = completeWithZero(date.getHours(), 2);
	    let minute = completeWithZero(date.getMinutes(), 2);
	    let second = completeWithZero(date.getSeconds(), 2);
	    let ms = completeWithZero(date.getMilliseconds(), 4);
	    return `${date.getFullYear()}_${month}_${dat}_${hour}_${minute}_${second}_${ms}`;
	};

	let completeWithZero = (v, len) => {
	    v = v + '';
	    if (v.length < len) {
	        v = repeatLetter('0', len - v.length) + v;
	    }
	    return v;
	};

	let repeatLetter = (letter, len) => {
	    let str = '';
	    for (let i = 0; i < len; i++) {
	        str += letter;
	    }
	    return str;
	};


/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @param direction string
	 *  direction = up | down | left | right
	 */
	module.exports = ({
	    left = 0, right = 0, top = 0, bottom = 0, color = 'black', direction = 'up'
	}) => {
	    if (direction === 'up') {
	        return {
	            width: 0,
	            height: 0,
	            'border-left': `${left}px solid transparent`,
	            'border-right': `${right}px solid transparent`,
	            'border-bottom': `${bottom}px solid ${color}`
	        };
	    } else if (direction === 'down') {
	        return {
	            width: 0,
	            height: 0,
	            'border-left': `${left}px solid transparent`,
	            'border-right': `${right}px solid transparent`,
	            'border-top': `${top}px solid ${color}`
	        };
	    } else if (direction === 'left') {
	        return {
	            width: 0,
	            height: 0,
	            'border-top': `${top}px solid transparent`,
	            'border-bottom': `${bottom}px solid transparent`,
	            'border-right': `${right}px solid ${color}`
	        };
	    } else if (direction === 'right') {
	        return {
	            width: 0,
	            height: 0,
	            'border-top': `${top}px solid transparent`,
	            'border-bottom': `${bottom}px solid transparent`,
	            'border-left': `${left}px solid ${color}`
	        };
	    } else {
	        throw new Error(`unexpeced direction ${direction}`);
	    }
	};


/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @param direction string
	 *  direction = up | down | left | right
	 */
	module.exports = ({
	    left = 0, right = 0, top = 0, bottom = 0, color = 'black', direction = 'up'
	}) => {
	    if (direction === 'up') {
	        return {
	            width: 0,
	            height: 0,
	            'border-left': `${left}px solid transparent`,
	            'border-right': `${right}px solid transparent`,
	            'border-bottom': `${bottom}px solid ${color}`
	        };
	    } else if (direction === 'down') {
	        return {
	            width: 0,
	            height: 0,
	            'border-left': `${left}px solid transparent`,
	            'border-right': `${right}px solid transparent`,
	            'border-top': `${top}px solid ${color}`
	        };
	    } else if (direction === 'left') {
	        return {
	            width: 0,
	            height: 0,
	            'border-top': `${top}px solid transparent`,
	            'border-bottom': `${bottom}px solid transparent`,
	            'border-right': `${right}px solid ${color}`
	        };
	    } else if (direction === 'right') {
	        return {
	            width: 0,
	            height: 0,
	            'border-top': `${top}px solid transparent`,
	            'border-bottom': `${bottom}px solid transparent`,
	            'border-left': `${left}px solid ${color}`
	        };
	    } else {
	        throw new Error(`unexpeced direction ${direction}`);
	    }
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	let fold = __webpack_require__(62);

	let triangle = __webpack_require__(60);

	let TreeSelect = __webpack_require__(49);

	let {
	    mergeMap
	} = __webpack_require__(38);

	/**
	 * @param options Array
	 *  options used to select
	 * @param onExpand
	 * @param onselected
	 *
	 */
	module.exports = view(({
	    options,
	    onExpand,
	    onselected,
	    hide
	}) => {
	    return n('div', {
	        style: {
	            display: 'inline-block'
	        }
	    }, [
	        fold({
	            head: (ops) => {
	                return n('div', {
	                    style: mergeMap(
	                        ops.isHide() ? triangle({
	                            direction: 'right',
	                            top: 5,
	                            bottom: 5,
	                            left: 5,
	                            color: '#737373'
	                        }) : triangle({
	                            direction: 'left',
	                            top: 5,
	                            bottom: 5,
	                            right: 5,
	                            color: '#737373'
	                        }), {
	                            position: 'absolute',
	                            bottom: 0,
	                            marginLeft: 5,
	                            cursor: 'pointer'
	                        }
	                    ),

	                    onclick: () => {
	                        ops.toggle();
	                        onExpand && onExpand(ops.isHide());
	                    }
	                });
	            },

	            hide,

	            body: () => {
	                return n('div', {
	                    style: {
	                        display: 'inline-block',
	                        marginLeft: 15,
	                        position: 'absolute',
	                        bottom: 0
	                    }
	                }, TreeSelect({
	                    data: options,
	                    onselected: (v, path) => {
	                        onselected && onselected(v, path);
	                    }
	                }));
	            }
	        })
	    ]);
	});


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	/**
	 * data = {
	 *    hide,
	 *    head,
	 *    body
	 * }
	 */
	module.exports = view((data, {
	    update
	}) => {
	    if (data.hide === undefined) data.hide = true;

	    let hide = () => update('hide', true);
	    let show = () => update('hide', false);
	    let toggle = () => update('hide', !data.hide);
	    let isHide = () => data.hide;

	    let ops = {
	        hide, show, toggle, isHide
	    };

	    return n('div', [
	        data.head(ops), !isHide() && data.body(ops)
	    ]);
	});


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getPredicatePath, getPredicateMetaInfo
	} = __webpack_require__(35);

	let {
	    map, mergeMap
	} = __webpack_require__(38);

	let getArgs = ({
	    value,
	    predicatesMetaInfo
	}) => {
	    let predicatePath = getPredicatePath(value.path);
	    let {
	        args
	    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath) || {};
	    return args || [];
	};

	const id = v => v;

	let getParamer = (data, {
	    itemRender
	}) => (index) => {
	    let {
	        value,
	        onchange = id
	    } = data;

	    let args = getArgs(data);

	    let opts = args[index] || {};

	    return itemRender(mergeMap(opts, {
	        title: opts.name,

	        value: mergeMap(value.params[index] || {}, opts.value || {}),

	        onchange: (itemValue) => {
	            // update by index
	            value.params[index] = itemValue;
	            onchange(value);
	        }
	    }));
	};

	let getPrefixParamser = (data, {
	    itemRender
	}) => (infix = 0) => {
	    let {
	        value,
	        onchange = id
	    } = data;

	    let args = getArgs(data);

	    let params = value.params.slice(0, infix);

	    return map(args.slice(0, infix), (opts, index) => {
	        opts = opts || {};

	        return itemRender(mergeMap(opts, {
	            title: opts.name,

	            value: mergeMap(params[index] || {}, opts.value || {}),

	            onchange: (itemValue) => {
	                params[index] = itemValue;
	                value.params = params.concat(value.params.slice(infix));
	                onchange(value);
	            }
	        }));
	    });
	};

	let getSuffixParamser = (data, {
	    itemRender
	}) => (infix = 0) => {
	    let {
	        value,
	        onchange = id
	    } = data;

	    let args = getArgs(data);

	    let params = value.params.slice(infix);

	    return map(args.slice(infix), (opts, index) => {
	        opts = opts || {};

	        return itemRender(mergeMap(opts, {
	            title: opts.name,

	            value: mergeMap(params[index] || {}, opts.value || {}),

	            onchange: (itemValue) => {
	                params[index] = itemValue;
	                value.params = value.params.slice(0, infix).concat(params);
	                onchange(value);
	            }
	        }));
	    });
	};

	module.exports = {
	    getPrefixParamser,
	    getSuffixParamser,
	    getParamer
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let EmptyExpressionView = __webpack_require__(65);

	let JsonDataView = __webpack_require__(67);

	let AbstractionView = __webpack_require__(81);

	let PredicateView = __webpack_require__(87);

	let VariableView = __webpack_require__(88);

	let {
	    getExpressionType,
	    getPredicatePath,
	    getPredicateMetaInfo
	} = __webpack_require__(35);

	let {
	    JSON_DATA,
	    ABSTRACTION,
	    VARIABLE,
	    PREDICATE
	} = __webpack_require__(46);

	/**
	 * choose the viewer to render expression
	 *
	 * @param viewer
	 *  pre-defined render function
	 *  TODO add test function for viewer as graceful degradation
	 */
	module.exports = ({
	    value, viewer, predicatesMetaInfo
	}, options) => {
	    // exists pre-defined viewer
	    if (viewer) {
	        if (!viewer.detect) {
	            return viewer;
	        } else {
	            // detect
	            if (viewer.detect(options)) {
	                return viewer;
	            }
	        }
	    }

	    let expressionType = getExpressionType(value.path);

	    if (expressionType === PREDICATE) {
	        // find pre-defined predicate function level viewer
	        let metaInfo = getPredicateMetaInfo(predicatesMetaInfo, getPredicatePath(value.path));
	        if (metaInfo.viewer) {
	            return (expOptions) => metaInfo.viewer(expOptions, metaInfo);
	        }
	    }

	    // choose the default expresion viewer
	    switch (expressionType) {
	        case PREDICATE:
	            return PredicateView;
	        case JSON_DATA:
	            return JsonDataView;
	        case VARIABLE:
	            return VariableView;
	        case ABSTRACTION:
	            return AbstractionView;
	        default:
	            return EmptyExpressionView;
	    }
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let expandorWrapper = __webpack_require__(66);

	module.exports = ({
	    getOptionsView,
	    getExpandor
	}) => {
	    return expandorWrapper(getOptionsView(), getExpandor());
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	module.exports = (expView, expandor) => {
	    return n('div class="expandor-wrapper"', [
	        // expression
	        n('div class="expression-wrapper"', expView),

	        // expandor
	        expandor
	    ]);
	};


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	let {
	    contain
	} = __webpack_require__(38);

	let fold = __webpack_require__(62);

	let foldArrow = __webpack_require__(68);

	let {
	    isObject
	} = __webpack_require__(9);

	let InputView = __webpack_require__(71);

	let expandorWrapper = __webpack_require__(66);

	const {
	    INLINE_TYPES, DEFAULT_DATA_MAP
	} = __webpack_require__(46);

	let {
	    getDataTypePath
	} = __webpack_require__(35);

	/**
	 * used to define json data
	 */
	module.exports = view(({
	    value, onchange = id, getOptionsView, getExpandor
	}) => {
	    let type = getDataTypePath(value.path);

	    let onValueChanged = (v) => {
	        value.value = v;
	        onchange(value);
	    };

	    let renderInputArea = () => {
	        return InputView({
	            content: value.value || DEFAULT_DATA_MAP[type],
	            type: value.type,
	            placeholder: value.placeholder,
	            onchange: onValueChanged
	        }, type);
	    };

	    return expandorWrapper(n('div', {
	        style: {
	            border: contain(INLINE_TYPES, type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
	            minWidth: 160
	        }
	    }, [
	        getOptionsView(),

	        n('div', {
	            style: {
	                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
	            }
	        }),

	        !contain(INLINE_TYPES, type) ? fold({
	            head: (ops) => n('div', {
	                style: {
	                    textAlign: 'right',
	                    cursor: 'pointer'
	                },
	                'class': 'lambda-ui-hover',
	                onclick: () => {
	                    ops.toggle();
	                }
	            }, [
	                ops.isHide() && n('span', {
	                    style: {
	                        color: '#9b9b9b',
	                        paddingRight: 60
	                    }
	                }, abbreText(value.value)),

	                foldArrow(ops)
	            ]),

	            body: renderInputArea,
	            hide: false
	        }) : renderInputArea()
	    ]), getExpandor());
	});

	let abbreText = (data) => {
	    let str = data;
	    if (isObject(data)) {
	        str = JSON.stringify(data);
	    }
	    if (str.length > 30) {
	        return str.substring(0, 27) + '...';
	    }
	    return str;
	};

	const id = v => v;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	let angle = __webpack_require__(69);

	module.exports = (ops) => {
	    return n('span', {
	        style: {
	            display: 'inline-block',
	            paddingRight: 8
	        }
	    }, angle({
	        direction: ops.isHide() ? 'bottom' : 'top',
	        length: 5,
	        color: '#666666'
	    }));
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let line = __webpack_require__(70);
	let {
	    n
	} = __webpack_require__(4);

	module.exports = ({
	    length = 10, bold = 1, color = 'black', angle = 0, direction
	} = {}) => {
	    if (direction === 'left') {
	        angle = 45;
	    } else if (direction === 'top') {
	        angle = 135;
	    } else if (direction === 'right') {
	        angle = 225;
	    } else if (direction === 'bottom') {
	        angle = 315;
	    }
	    return n('div', {
	        style: {
	            display: 'inline-block',
	            transform: `rotate(${angle}deg)`
	        }
	    }, [
	        line({
	            color,
	            bold,
	            length
	        }),

	        n('div', {
	            style: {
	                marginLeft: length / 2 - bold / 2,
	                marginTop: -1 * length / 2 - bold / 2
	            }
	        }, [
	            line({
	                color,
	                bold,
	                length,
	                angle: 90
	            })
	        ])
	    ]);
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	module.exports = ({
	    color = 'black', bold = 3, length = 20, direction = 'vertical', angle = 0
	} = {}) => {
	    return direction === 'vertical' ?
	        n('div', {
	            style: {
	                width: bold,
	                height: length,
	                backgroundColor: color,
	                transform: `rotate(${angle}deg)`
	            }
	        }) : n('div', {
	            style: {
	                height: bold,
	                width: length,
	                backgroundColor: color,
	                transform: `rotate(${angle}deg)`
	            }
	        });
	};


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let boolInput = __webpack_require__(72);

	let numberInput = __webpack_require__(77);

	let textInput = __webpack_require__(78);

	let jsonCodeInput = __webpack_require__(79);

	let nullInput = __webpack_require__(80);

	let {
	    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL
	} = __webpack_require__(46);

	let inputViewMap = {
	    [NUMBER]: numberInput,
	    [STRING]: textInput,
	    [BOOLEAN]: boolInput,
	    [JSON_TYPE]: jsonCodeInput,
	    [NULL]: nullInput
	};

	module.exports = (data, type) => {
	    let v = inputViewMap[type];

	    return v && v(data);
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view
	} = __webpack_require__(4);

	let SelectView = __webpack_require__(73);

	module.exports = view((data) => {
	    let {
	        content,
	        onchange
	    } = data;

	    return SelectView({
	        options: [
	            ['true'],
	            ['false']
	        ],
	        selected: content === true ? 'true' : 'false',
	        onchange: (v) => {
	            let ret = false;
	            if (v === 'true') {
	                ret = true;
	            }
	            data.content = ret;
	            onchange && onchange(v);
	        }
	    });
	});


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    map
	} = __webpack_require__(74);

	let {
	    n, view
	} = __webpack_require__(4);

	/**
	 * {
	 *
	 *      options: [[name, description]],
	 *
	 *      selected
	 * }
	 */

	module.exports = view((data) => {
	    data.selected = data.selected || data.options[0][0];

	    let onchange = data.onchange;

	    return n('select', {
	        onchange: (e) => {
	            data.selected = e.target.value;
	            onchange && onchange(data.selected);
	        }
	    }, map(data.options, ([name, description]) => {
	        let selectStr = '';
	        if (data.selected === name) {
	            selectStr = 'selected="selected"';
	        }

	        if (description === undefined) {
	            description = name;
	        }

	        return n(`option value=${name} ${selectStr}`, description);
	    }));
	});


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(9);

	let iterate = __webpack_require__(75);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(76);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(9);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(75);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	module.exports = view((data) => {
	    let {
	        content,
	        placeholder,
	        onchange
	    } = data;

	    return n(`input type="number" placeholder="${placeholder||''}"`, {
	        style: {
	            marginTop: -10
	        },
	        value: content,
	        oninput: (e) => {
	            let num = Number(e.target.value);
	            data.content = num;
	            onchange && onchange(num);
	        }
	    });
	});


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

	module.exports = view((data) => {
	    let {
	        type,
	        placeholder,
	        content,
	        onchange
	    } = data;

	    return n(`input type="${type || 'text'}" placeholder="${placeholder || ''}"`, {
	        style: {
	            marginTop: -10
	        },

	        value: content,

	        oninput: (e) => {
	            data.content = e.target.value;
	            onchange && onchange(e.target.value);
	        }
	    });
	});


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(4);

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


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	module.exports = () => {
	    return n('span', 'null');
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	let VariableDeclareView = __webpack_require__(82);

	let expandorWrapper = __webpack_require__(66);

	let {
	    VARIABLE
	} = __webpack_require__(46);

	module.exports = view(({
	    value,
	    variables,
	    getOptionsView,
	    getExpandor,
	    onchange,
	    expressionBody
	}, {
	    update
	}) => {
	    return () => expandorWrapper(n('div', [
	        getOptionsView(),

	        n('div', {
	            style: {
	                marginLeft: 15,
	                marginTop: 5,
	                padding: 5
	            }
	        }, [
	            n('div', {
	                style: {
	                    border: '1px solid rgba(200, 200, 200, 0.4)',
	                    borderRadius: 5,
	                    padding: 5
	                }
	            }, [
	                VariableDeclareView({
	                    onchange: (v) => {
	                        value.currentVariables = v;
	                        expressionBody.updateVariables(variables.concat(value.currentVariables));
	                        onchange(value);
	                        update();
	                    },

	                    variables: value.currentVariables,
	                    prevVariables: variables,
	                    title: VARIABLE,
	                })
	            ]),

	            n('div', {
	                style: {
	                    marginTop: 5
	                }
	            }, [
	                expressionBody.getView()
	            ])
	        ])
	    ]), getExpandor());
	});


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	let InputList = __webpack_require__(83);

	let {
	    reduce, map
	} = __webpack_require__(38);

	// used to define variables
	// TODO variables detect
	module.exports = view((data) => {
	    let {
	        title,
	        variables = [], onchange = v => v
	    } = data;

	    return n('div', {
	        'class': 'lambda-variable'
	    }, [
	        InputList({
	            value: map(variables, (variable) => {
	                return variable || '';
	            }),

	            title: n('span', {
	                style: {
	                    color: '#9b9b9b',
	                    fontSize: 14
	                }
	            }, title),

	            onchange: (v) => {
	                // TODO check variable definition
	                onchange(reduce(v, (prev, item) => {
	                    item && prev.push(item.trim());
	                    return prev;
	                }, []));

	                data.variables = v;
	            }
	        })
	    ]);
	});


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let dynamicList = __webpack_require__(84);

	let {
	    map, mergeMap
	} = __webpack_require__(38);

	let {
	    n
	} = __webpack_require__(4);

	let plus = __webpack_require__(85);

	let line = __webpack_require__(86);

	let Input = ({
	    value = '', onchange, type = 'text', style, placeholder = ''
	}) => {
	    return n(`input type="${type}" placeholder="${placeholder}"`, {
	        value,
	        style,
	        oninput: (e) => {
	            onchange && onchange(e.target.value);
	        }
	    });
	};

	module.exports = ({
	    value,
	    defaultItem,
	    title,
	    itemOptions = {}, onchange = id, itemRender = Input
	}) => {
	    return dynamicList({
	        // append or delete items happend
	        onchange: () => onchange(value),

	        value,

	        defaultItem,

	        render: ({
	            appendItem, deleteItem, value
	        }) => {
	            return n('div', {
	                style: {
	                    display: 'inline-block'
	                }
	            }, [
	                n('span', [
	                    n('span', title), n('span', {
	                        style: {
	                            cursor: 'pointer',
	                            paddingLeft: 15,
	                            fontWeight: 'bold'
	                        },
	                        onclick: appendItem
	                    }, n('div', {
	                        style: {
	                            display: 'inline-block'
	                        }
	                    }, plus({
	                        width: 10,
	                        height: 10,
	                        bold: 3,
	                        color: 'black'
	                    })))
	                ]),

	                map(value, (item, index) => {
	                    return n('fieldset', [
	                        itemRender(mergeMap(
	                            itemOptions, {
	                                value: item,
	                                onchange: (v) => {
	                                    value[index] = v;
	                                    onchange(value);
	                                }
	                            }
	                        )),

	                        n('span', {
	                            style: {
	                                cursor: 'pointer',
	                                fontWeight: 'bold'
	                            },
	                            onclick: () => deleteItem(item, index)
	                        }, n('div', {
	                            style: {
	                                display: 'inline-block',
	                                marginLeft: 5
	                            }
	                        }, [
	                            line({
	                                length: 10,
	                                bold: 3,
	                                color: 'black',
	                                direction: 'horizontal'
	                            })
	                        ]))
	                    ]);
	                })
	            ]);
	        }
	    });
	};

	const id = v => v;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view
	} = __webpack_require__(4);

	let {
	    isFunction
	} = __webpack_require__(9);

	/**
	 * dynamic list,
	 *   (1) add item
	 *   (2) delete item
	 *   (3) show list
	 *   (4) maintain list data
	 *
	 * @param render function
	 *  render dom by value
	 */
	module.exports = view(({
	    value,
	    defaultItem = '', render, onchange = id,
	}, {
	    update
	}) => {
	    let appendItem = () => {
	        let item = defaultItem;
	        if (isFunction(defaultItem)) {
	            item = defaultItem();
	        } else {
	            item = JSON.parse(JSON.stringify(defaultItem));
	        }
	        value.push(item);
	        onchange({
	            value, type: 'append', item
	        });
	        // update view
	        update();
	    };

	    let deleteItem = (item, index) => {
	        if (index !== -1) {
	            value.splice(index, 1);
	            // update view
	            onchange({
	                item, index, type: 'delete', value
	            });
	            update();
	        }
	    };

	    return render({
	        value,
	        appendItem,
	        deleteItem
	    });
	});

	const id = v => v;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	let line = __webpack_require__(86);

	module.exports = ({
	    width,
	    height,
	    color,
	    bold
	}) => {
	    return n('div', {
	        style: {
	            width,
	            height,
	            margin: 0, padding: 0
	        }
	    }, [
	        n('div', {
	            style: {
	                position: 'relative',
	                left: 0,
	                top: (height - bold) / 2
	            }
	        }, [
	            line({
	                length: width,
	                bold,
	                color,
	                direction: 'horizontal'
	            })
	        ]),

	        n('div', {
	            style: {
	                position: 'relative',
	                top: -1 * bold,
	                left: (width - bold) / 2
	            }
	        }, [
	            line({
	                length: height,
	                bold,
	                color
	            })
	        ])
	    ]);
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	module.exports = ({
	    color = 'black', bold = 3, length = 20, direction = 'vertical'
	} = {}) => {
	    return direction === 'vertical' ?
	        n('div', {
	            style: {
	                width: bold,
	                height: length,
	                backgroundColor: color
	            }
	        }) : n('div', {
	            style: {
	                height: bold,
	                width: length,
	                backgroundColor: color
	            }
	        });
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	let {
	    map
	} = __webpack_require__(38);

	let expandorWrapper = __webpack_require__(66);

	module.exports = view(({
	    value,
	    getOptionsView,
	    getExpandor,
	    getPrefixParams,
	    getSuffixParams
	}) => {
	    return expandorWrapper(n('div', [
	        arrangeItems(getPrefixParams(value.infix)),

	        getOptionsView(),

	        n('div', {
	            style: {
	                display: value.infix ? 'inline-block' : 'block'
	            }
	        }, [
	            arrangeItems(getSuffixParams(value.infix))
	        ])
	    ]), getExpandor());
	});

	let arrangeItems = (itemViews) => n('div', {
	    'class': 'lambda-params',
	    style: {
	        display: 'inline-block'
	    }
	}, [
	    map(itemViews, (itemView) => {
	        return n('fieldset', {
	            style: {
	                padding: '4px'
	            }
	        }, itemView);
	    })
	]);


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, view
	} = __webpack_require__(4);

	let expandorWrapper = __webpack_require__(66);

	module.exports = view(({
	    getOptionsView, getExpandor
	}) => {
	    return () => expandorWrapper(n('div', [getOptionsView()]), getExpandor());
	});


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const LAMBDA_STYLE = __webpack_require__(90);

	let {
	    n
	} = __webpack_require__(4);

	module.exports = ({
	    styleStr = LAMBDA_STYLE
	} = {}) => {
	    let $style = document.getElementById('lambda-style');
	    if (!$style) {
	        $style = n('style id="lambda-style" type="text/css"', styleStr);
	        document.getElementsByTagName('head')[0].appendChild($style);
	    }
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let formStyle = __webpack_require__(91);

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

	` + formStyle;


/***/ },
/* 91 */
/***/ function(module, exports) {

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


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isFunction, funType, isObject
	} = __webpack_require__(9);

	/**
	 * define meta info at a function
	 *
	 * info = {
	 *    viewer,
	 *    args: [{}, {}, ..., {}]
	 * }
	 */

	module.exports = funType((fun, meta) => {
	    fun.meta = meta;
	    return fun;
	}, [isFunction, isObject]);


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	let {
	    map
	} = __webpack_require__(38);

	let {
	    PREDICATE
	} = __webpack_require__(46);

	let form = ({
	    value,
	    expressionType,
	    getSuffixParams
	}, {
	    title
	} = {}) => {
	    let parts = value.path.split('.');
	    title = title || parts[parts.length - 1];

	    return n('form class="expression-wrapper"', {
	        onclick: (e) => {
	            e.preventDefault();
	        }
	    }, [
	        n('h3', title),

	        map(getSuffixParams(0), (item) => {
	            return n('div', {
	                style: {
	                    padding: 8
	                }
	            }, item);
	        })
	    ]);
	};

	form.detect = ({
	    expressionType
	}) => {
	    return expressionType === PREDICATE;
	};

	module.exports = form;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(4);

	let {
	    JSON_DATA
	} = __webpack_require__(46);

	let {
	    getDataTypePath
	} = __webpack_require__(35);

	let InputView = __webpack_require__(71);

	module.exports = ({
	    value,
	    onchange,
	    expressionType
	}, {
	    title,
	    placeholder,
	    inputType = 'text'
	}) => {
	    if (expressionType !== JSON_DATA) {
	        return;
	    }

	    let onValueChanged = (v) => {
	        value.value = v;
	        onchange(value);
	    };

	    return n('fieldset', [
	        n('label', [title]),

	        InputView({
	            content: value.value,
	            type: inputType,
	            placeholder: placeholder,
	            onchange: onValueChanged
	        }, getDataTypePath(value.path))
	    ]);
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    JSON_DATA
	} = __webpack_require__(46);

	let Select = __webpack_require__(73);

	let {
	    n
	} = __webpack_require__(4);

	/**
	 * simple select ui for leta-ui
	 */
	let simpleSelect = ({
	    value,
	    onchange
	}, {
	    title,
	    options
	}) => {
	    return n('fieldset', [
	        n('label', [title]),

	        Select({
	            selected: value.value,
	            onchange: (one) => {
	                value.value = one;
	                onchange(value);
	            },
	            options
	        })
	    ]);
	};

	simpleSelect.detect = ({
	    expresionType
	}) => expresionType === JSON_DATA;

	module.exports = simpleSelect;


/***/ }
/******/ ]);