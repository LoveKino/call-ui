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

	let LambdaUI = __webpack_require__(1);

	/**
	 * type system
	 *   basic type: number, string, boolean, function, object, array
	 */
	document.body.appendChild(LambdaUI({
	    predicates: {
	        math: {
	            '+': (x, y) => x + y
	        }
	    },

	    predicatesMetaInfo: {
	        math: {
	            '+': {
	                args: [{
	                    type: 'number',
	                    name: 'number'
	                }, {
	                    type: 'number',
	                    name: 'number'
	                }]
	            }
	        }
	    }
	}));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(3);

	let {
	    map, get
	} = __webpack_require__(10);

	let InputList = __webpack_require__(40);

	let TreeOptionView = __webpack_require__(47);

	/**
	 * lambda UI editor
	 *
	 * π calculus
	 *
	 * e ::= x              a variable
	 *   |   πx.e           an abstraction (function)
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
	 *    πx₁x₂...x.e
	 *
	 * 5. application
	 *    e₁e₂e₃...
	 *
	 * π based on predicates and json expansion
	 *
	 * e ::= json                    as meta data, also a pre-defined π expression
	 *   |   x                       variable
	 *   |   predicate               predicate is a pre-defined abstraction
	 *   |   πx.e                    abstraction
	 *   |   e1e2                    application
	 *
	 */

	// expression type
	const EXPRESSION_TYPES = ['application', 'variable', 'json', 'abstraction', 'predicate'];

	const [APPLICATION, VARIABLE, JSON_DATA, ABSTRACTION, PREDICATE] = EXPRESSION_TYPES;

	/**
	 * expression user interface
	 *
	 * 1. user choses expression type
	 * 2. define current expression type
	 */
	module.exports = view(({
	    predicates,
	    predicatesMetaInfo
	}) => {
	    document.getElementsByTagName('head')[0].appendChild(n('style', {
	        type: 'text/css'
	    }, `.lambda-variable fieldset{
	    display: inline-block;
	    border: 1px solid rgba(200, 200, 200, 0.4);
	    padding: 1px 4px;
	}
	.lambda-variable input{
	    width: 30px;
	    outline: none;
	} 
	    `));

	    return declareView({
	        predicates,
	        predicatesMetaInfo
	    });
	});

	let declareView = view(({
	    predicates,
	    predicatesMetaInfo,
	    expressionType,
	    path
	}, {
	    update
	}) => {
	    return n('div', {
	        style: {
	            display: 'inline-block',
	            padding: 8,
	            border: '1px solid rgba(200, 200, 200, 0.4)'
	        }
	    }, [
	        TreeOptionView({
	            data: {
	                [JSON_DATA]: 1, // declare json data
	                [ABSTRACTION]: 1, // declare function
	                [PREDICATE]: predicates // declare function
	            },
	            onselected: (v, path) => {
	                update([
	                    ['path', path],
	                    ['expressionType', getExpressionType(path)]
	                ]);
	            }
	        }),

	        expressionType && n('div', {
	            style: {
	                border: '1px solid rgba(200, 200, 200, 0.4)',
	                marginTop: 5,
	                padding: 5
	            }
	        }, [
	            expressionType === JSON_DATA ? jsonDataView({
	                predicates, predicatesMetaInfo
	            }) :
	            expressionType === PREDICATE ? predicateView({
	                path, predicates, predicatesMetaInfo
	            }) :
	            expressionType === ABSTRACTION ? abstractionView({
	                predicates,
	                predicatesMetaInfo
	            }) :
	            null
	        ])
	    ]);
	});

	let abstractionView = view(({
	    predicates,
	    predicatesMetaInfo
	}) => {
	    return n('div', [
	        variableView({}),
	        n('div', [
	            n('div', {
	                style: {
	                    marginTop: 4
	                }
	            },'expression'),
	            n('div', {
	                style: {
	                    margin: '10px'
	                }
	            },[
	                declareView({
	                    predicates,
	                    predicatesMetaInfo
	                })
	            ])
	        ])
	    ]);
	});

	// used to define variables
	let variableView = view(() => {
	    return n('div', {
	        'class': 'lambda-variable'
	    }, [
	        InputList({
	            listData: [],
	            title: VARIABLE
	        })
	    ]);
	});

	let predicateView = view(({
	    path,
	    predicatesMetaInfo,
	    predicates
	}) => {
	    let predicatePath = getPredicatePath(path);
	    let {
	        args
	    } = get(predicatesMetaInfo, predicatePath);
	    return n('div', [
	        n('span', predicatePath),
	        paramsFieldView({
	            args,
	            predicates,
	            predicatesMetaInfo
	        })
	    ]);
	});

	let paramsFieldView = view(({
	    args,
	    predicates,
	    predicatesMetaInfo
	}) => {
	    return n('div', [
	        map(args, ({
	            name
	        }) => {
	            return n('fieldset', [
	                name && n('label', name),
	                declareView({
	                    predicatesMetaInfo,
	                    predicates
	                })
	            ]);
	        })
	    ]);
	});

	/**
	 * used to define json data
	 */
	let jsonDataView = view(() => {
	    return n('div', [
	        n('input')
	    ]);
	});

	let getExpressionType = (path) => {
	    return path.split('.')[0];
	};

	let getPredicatePath = (path) => path.split('.').slice(1).join('.');


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n, svgn, bindPlugs
	} = __webpack_require__(5);

	let plugs = __webpack_require__(15);

	let view = __webpack_require__(19);

	let mount = __webpack_require__(25);

	module.exports = {
	    n,
	    svgn,
	    view,
	    plugs,
	    bindPlugs,
	    mount
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    createElement, createSvgElement, parseArgs, nodeGener
	} = __webpack_require__(6);

	let {
	    bindEvents
	} = __webpack_require__(13);

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isString, isObject, isNode, likeArray, isNumber, isBool
	} = __webpack_require__(8);

	let parseAttribute = __webpack_require__(9);

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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isString, isObject
	} = __webpack_require__(8);

	let {
	    mergeMap
	} = __webpack_require__(10);

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(8);

	let iterate = __webpack_require__(11);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(12);

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(8);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(11);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let EventMatrix = __webpack_require__(14);

	let {
	    addHandler,
	    removeTree,
	    removeNode,
	    getNodeHandleMap,
	    attachDocument
	} = EventMatrix();

	let bindEvents = (node, eventMap) => {
	    for (let type in eventMap) {
	        addHandler(type, node, eventMap[type]);
	    }
	};

	let clearBelow = removeTree;

	let moveNodeEvent = (target, source) => {
	    let handleMap = getNodeHandleMap(source);
	    removeNode(target);

	    for (let type in handleMap) {
	        let handlers = handleMap[type];
	        for (let i = 0; i < handlers.length; i++) {
	            let handler = handlers[i];
	            addHandler(type, target, handler);
	        }
	    }

	    //
	    removeNode(source);
	};

	module.exports = {
	    bindEvents,
	    clearBelow,
	    moveNodeEvent,
	    attachDocument
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    findIndex, contain, map, forEach
	} = __webpack_require__(10);

	module.exports = () => {
	    let matrix = {};
	    let docs = [];

	    let addHandler = (type, node, handler) => {
	        let handlerObjs = matrix[type];
	        if (!handlerObjs) {
	            updateDocs(type);
	            // add new type
	            handlerObjs = matrix[type] = [{
	                node,
	                handlers: []
	            }];
	        }

	        let handlers = getHandlers(type, node);
	        if (!handlers) {
	            handlers = [];
	            matrix[type].push({
	                node,
	                handlers
	            });
	        }
	        if (!contain(handlers, handler)) {
	            handlers.push(handler);
	        }
	    };

	    let attachDocument = (doc = document) => {
	        if (!contain(docs, doc)) {
	            for (let type in matrix) {
	                doc.addEventListener(type, listener(type));
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

	    let getNodeHandleMap = (item) => {
	        let map = {};
	        for (let type in matrix) {
	            let handlers = getHandlers(type, item);
	            if (handlers) map[type] = handlers;
	        }
	        return map;
	    };

	    let removeHandler = (type, node, handler) => {
	        let handlers = getHandlers(type, node);
	        if (handlers && handler.length) {
	            let index = findIndex(handlers, handler);
	            if (index !== -1) {
	                handlers.splice(index, 1);
	            }
	        }
	    };

	    let removeTree = (item) => {
	        for (let type in matrix) {
	            let handlerObjs = matrix[type];
	            for (let i = 0; i < handlerObjs.length; i++) {
	                let {
	                    node
	                } = handlerObjs[i];
	                if (below(node, item)) {
	                    // remove i
	                    handlerObjs.splice(i, 1);
	                    i = i - 1;
	                }
	            }
	        }
	    };

	    let removeNode = (item) => {
	        for (let type in matrix) {
	            let handlerObjs = matrix[type];
	            for (let i = 0; i < handlerObjs.length; i++) {
	                let {
	                    node
	                } = handlerObjs[i];
	                if (node === item) {
	                    // remove node
	                    handlerObjs.splice(i, 1);
	                    break;
	                }
	            }
	        }
	    };

	    let listener = (type) => function(e) {
	        let target = e.target;
	        let nodePath = getNodePath(target);

	        let oldProp = e.stopPropagation;
	        e.stopPropagation = function() {
	            e.__stopPropagation = true;
	            oldProp.apply(this, arguments);
	        };

	        let handlersList = map(nodePath, (curNode) => getHandlers(type, curNode));
	        forEach(handlersList, (handlers) => {
	            if (handlers && handlers.length) {
	                for (let j = 0; j < handlers.length; j++) {
	                    if (e.__stopPropagation) {
	                        return true;
	                    }

	                    let handler = handlers[j];
	                    handler.apply(this, [e]);
	                }
	            }
	        });
	    };

	    let getHandlers = (type, target) => {
	        let handlerObjs = matrix[type];
	        for (let i = 0; i < handlerObjs.length; i++) {
	            let {
	                node, handlers
	            } = handlerObjs[i];
	            if (node === target) {
	                return handlers;
	            }
	        }

	        return null;
	    };

	    return {
	        addHandler,
	        removeHandler,
	        removeTree,
	        removeNode,
	        getNodeHandleMap,
	        attachDocument
	    };
	};

	let getNodePath = (target) => {
	    let paths = [];
	    while (target) {
	        paths.push(target);
	        target = target.parentNode;
	    }
	    return paths;
	};

	let below = (node, ancestor) => {
	    while (node) {
	        if (node === ancestor) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let twowaybinding = __webpack_require__(16);
	let eventError = __webpack_require__(18);

	module.exports = {
	    twowaybinding,
	    eventError
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    get, set
	} = __webpack_require__(17);

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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(10);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(8);

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
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    set
	} = __webpack_require__(17);

	let {
	    isObject, isFunction, likeArray
	} = __webpack_require__(8);

	let {
	    forEach
	} = __webpack_require__(10);

	let replace = __webpack_require__(20);

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

	    let initData = (obj) => {
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    moveNodeEvent, clearBelow
	} = __webpack_require__(13);

	let {
	    toArray
	} = __webpack_require__(17);

	let {
	    isNode
	} = __webpack_require__(8);

	let {
	    forEach
	} = __webpack_require__(10);

	let applyAttibutes = __webpack_require__(21);

	let replaceDirectly = (node, newNode) => {
	    let parent = node.parentNode;
	    if (parent) {
	        // clear node's events
	        clearBelow(node);
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
	        clearBelow(oldNode);
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
	    // events
	    moveNodeEvent(node, newNode);
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    getAttributeMap
	} = __webpack_require__(22);

	let {
	    hasOwnProperty
	} = __webpack_require__(17);

	let {
	    forEach
	} = __webpack_require__(10);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let shadowFrame = __webpack_require__(23);

	let startMomenter = __webpack_require__(24);

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
/* 23 */
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
/* 24 */
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    attachDocument
	} = __webpack_require__(13);

	let {
	    isNode
	} = __webpack_require__(8);

	let {
	    flat, forEach
	} = __webpack_require__(10);

	module.exports = (rootNode, parentNode) => {
	    rootNode = flat(rootNode);
	    forEach(rootNode, (item) => {
	        if (isNode(item)) {
	            parentNode.appendChild(item);
	        }
	    });
	    attachDocument(getDoc(parentNode));
	};

	let getDoc = (node) => {
	    while (node.parentNode) {
	        node = node.parentNode;
	    }
	    return node;
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(3);

	let {
	    map, compact, mergeMap
	} = __webpack_require__(27);

	let {
	    isObject
	} = __webpack_require__(8);

	let {
	    getWindowWidth, getWindowHeight
	} = __webpack_require__(30);

	let {
	    hasOwnProperty
	} = __webpack_require__(33);

	let idgener = __webpack_require__(37);

	let triangle = __webpack_require__(39);

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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(8);

	let iterate = __webpack_require__(28);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse
	} = __webpack_require__(29);

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
	    reverse
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(8);

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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(28);

	let {isFunction} = __webpack_require__(8);

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

	module.exports = {
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let shadowFrame = __webpack_require__(31);

	let startMomenter = __webpack_require__(32);

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
/* 31 */
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
/* 32 */
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(34);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(8);

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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(8);

	let iterate = __webpack_require__(35);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(36);

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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(8);

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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(35);

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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38);


/***/ },
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let dynamicList = __webpack_require__(41);

	let {
	    map, mergeMap
	} = __webpack_require__(42);

	let {
	    n
	} = __webpack_require__(3);

	let plus = __webpack_require__(45);

	let line = __webpack_require__(46);

	module.exports = ({
	    listData,
	    defaultItem,
	    title
	}) => {
	    return dynamicList({
	        listData,
	        defaultItem,
	        render: ({
	            appendItem, deleteItem, listData
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

	                map(listData, (item) => {
	                    return n('fieldset', [
	                        n('input type="text"', mergeMap({
	                            onkeyup: (e) => {
	                                item.value = e.target.value;
	                            }
	                        }, item)),

	                        n('span', {
	                            style: {
	                                cursor: 'pointer',
	                                fontWeight: 'bold'
	                            },
	                            onclick: () => deleteItem(item)
	                        }, n('div', {
	                            style: {
	                                display: 'inline-block',
	                                marginLeft: 5
	                            }
	                        },[
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


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    findIndex, mergeMap
	} = __webpack_require__(42);

	let {
	    view
	} = __webpack_require__(3);

	let {
	    isFunction
	} = __webpack_require__(8);

	/**
	 * dynamic list,
	 *   (1) add item
	 *   (2) delete item
	 *   (3) show list
	 *   (4) maintain list data
	 *
	 * @param render function
	 *  render dom by listData
	 */
	module.exports = view(({
	    listData,
	    defaultItem,
	    render
	}, {
	    update
	}) => {
	    let appendItem = () => {
	        let value = defaultItem;
	        if (isFunction(defaultItem)) {
	            value = defaultItem();
	        } else {
	            value = mergeMap(defaultItem);
	        }
	        listData.push(value);
	        // update view
	        update();
	    };

	    let deleteItem = (item) => {
	        let index = findIndex(listData, item);
	        if (index !== -1) {
	            listData.splice(index, 1);
	            // update view
	            update();
	        }
	    };

	    return render({
	        listData,
	        appendItem,
	        deleteItem
	    });
	});


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(8);

	let iterate = __webpack_require__(43);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse
	} = __webpack_require__(44);

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
	    reverse
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(8);

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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(43);

	let {isFunction} = __webpack_require__(8);

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

	module.exports = {
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(3);

	let line = __webpack_require__(46);

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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    n
	} = __webpack_require__(3);

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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    view, n
	} = __webpack_require__(3);

	let TreeSelect = __webpack_require__(26);

	module.exports = view(({
	    path,
	    data,
	    showSelectTree,
	    onselected
	}, {
	    update
	}) => {
	    return n('div', {
	        style: {
	            position: 'relative'
	        }
	    }, [
	        n('div', {
	            style: {
	                border: '1px solid rgba(200, 200, 200, 0.8)',
	                borderRadius: 6,
	                padding: 5,
	                cursor: 'pointer',
	                width: 160
	            },

	            onclick: () => {
	                update('showSelectTree', !showSelectTree);
	            }
	        }, path ? n('span', path) : n('span', 'please select')),

	        n('div', {
	            style: {
	                position: 'absolute',
	                backgroundColor: 'white'
	            }
	        }, [
	            showSelectTree && TreeSelect({
	                data,
	                onselected: (v, p) => {
	                    onselected && onselected(v, p);
	                    update([
	                        ['path', p],
	                        ['showSelectTree', false]
	                    ]);
	                }
	            })
	        ])
	    ]);
	});


/***/ }
/******/ ]);