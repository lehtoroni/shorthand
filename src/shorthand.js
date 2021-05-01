/*
 *    _                                     
 *  _| |_ _           _   _____           _ 
 * |   __| |_ ___ ___| |_|  |  |___ ___ _| |
 * |__   |   | . |  _|  _|     | .'|   | . |
 * |_   _|_|_|___|_| |_| |__|__|__,|_|_|___|
 *   |_|                                    
 * $hortHand (c) Roni Lehto 2021
 * Licensed under the MIT license - see 'LICENSE' for details
 */


if (window.$H) {
    throw new Error('$hortHand has been already loaded');
}

(()=>{
    
    /**
     * Parses HTML into DOM nodes
     * @param {string} content - the content to parse
     */
    const parseHTML = (content) => {
        const el = document.createElement('body');
        el.innerHTML = content;
        return new ShorthandArray(el.childNodes);
    }
    
    /**
     * @classdesc An array-like list of elements. Used to manipulate
     * one or more DOM elements and nodes. Can be obtained from `$H`
     * e.g. by querying or creating elements.
     * @class
     * @hideconstructor
     */
    class ShorthandArray extends Array {
        
        constructor(baseElements){
            if (baseElements) {
                if (!(typeof baseElements[Symbol.iterator] === 'function')) baseElements = [];
                super(...baseElements);
            } else {
                super();
            }
        }
        
        /**
         * Filter and return elements matching a CSS selector
         * @param {string} query - the CSS selector
         * @returns {ShorthandArray} the found elements
         */
        find(query){
            const outArr = new ShorthandArray();
            this.forEach(elm => outArr.push(...elm.querySelectorAll(query)));
            return outArr;
        }
        
        /**
         * Find the siblings of these elements
         * @returns {ShorthandArray} the found elements
         */
        siblings(){
            const outArr = new ShorthandArray();
            this.forEach(elm => {
                outArr.push(...[...elm.parentNode.children].filter(subElm => subElm !== elm));
            });
            return outArr;
        }
        
        /**
         * Return the closest matching elements to these elements
         * @param {string} query - the CSS selector
         * @returns {ShorthandArray} the closest queried elements
         */
        closest(query){
            const outArr = new ShorthandArray();
            this.forEach(elm => outArr.push(...elm.closest(query)));
            return outArr;
        }
        
        /**
         * Check if all of these elements match a query
         * @param {string} query - the CSS selector
         * @returns {boolean} the result
         */
        is(query){
            return this.every(elm => elm.matches(query));
        }
        
        /**
         * Check if any of these elements match a query
         * @returns {boolean} the result
         */
        isAny(query){
            return this.some(elm => elm.matches(query));
        }
        
        /**
         * Set or query the inner html content of these elements
         * @param {string} content - the HTML content, or undefined if querying
         * @returns {string|ShorthandArray} - the queried content or the list of elements
         */
        html(){
            if (arguments.length > 0) {
                this.forEach(elm => elm.innerHTML = arguments[0]);
                return this;
            }
            return this.map(elm => elm.innerHTML).join('');
        }
        
        /**
         * Set or query the inner text of these elements
         * @param {string} content - the content to set, or undefined if querying
         * @returns {string|ShorthandArray} - the queried content or the list of elements
         */
        text(){
            if (arguments.length > 0) {
                this.forEach(elm => elm.innerText = arguments[0]);
                return this;
            }
            return this.map(elm => elm.innerText).join('');
        }
        
        /**
         * Set or query attributes of these elements
         * @param {string} key - the attribute key
         * @param {any} value - the value to set, or undefined if querying
         * @returns {string|ShorthandArray} the queried attribute or
         * the current list of elements (to be chained)
         */
        attr(){
            if (arguments.length == 1) {
                for (const elm of this) return elm.getAttribute(arguments[0]);
            } else if (arguments.length == 2) {
                if (arguments[1] == '' || arguments[1] == null) {
                    this.forEach(elm => elm.removeAttribute(arguments[0]));
                } else {
                    this.forEach(elm => elm.setAttribute(arguments[0], arguments[1]));
                }
            } else {
                throw new Error('You need to specify arguments for .attr()');
            }
            return this;
        }
        
        /**
         * Set or query current value of input(s)
         * @param {any} content - the content to set
         * @returns {any|ShorthandArray} the value of the elements if queried,
         * or the current list of elements (to be chained)
         */
        val(){
            if (arguments.length > 0) {
                for (const elm of this) elm.value = arguments[0];
            } else {
                for (const elm of this) return elm.value;
            }
            return this;
        }
        
        /**
         * Add a classes to these elements
         * @param {...string} className - the name of the class
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        addClass(){
            for (const className of arguments) {
                this.forEach(elm => elm.classList.add(className));
            }
            return this;
        }
        
        /**
         * Remove classes from these elements
         * @param {...string} className - the name of the class
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        removeClass(){
            for (const className of arguments) {
                this.forEach(elm => elm.classList.remove(className));
            }
            return this;
        }
        
        /**
         * Toggle a class on these elements
         * @param {string} className - the class name to toggle
         * @param {boolean} state - the state to toggle into (or undefined if toggling)
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        toggleClass(){
            
            // toggleClass(className)
            if (arguments.length == 1) {
                const className = arguments[0];
                this.forEach(elm => {
                    if (elm.classList.contains(className)) {
                        elm.classList.remove(className);
                    } else {
                        elm.classList.add(className);
                    }
                });
            
            // toggleClass(className, state)
            } else if (arguments.length == 2) {
                if (arguments.length == 1) {
                    
                    const className = arguments[0];
                    
                    this.forEach(elm => {
                        if (!arguments[2]) {
                            elm.classList.remove(className);
                        } else {
                            elm.classList.add(className);
                        }
                    });
                    
                }
            }
            
            return this;
            
        }
        
        /**
         * Set or query CSS value(s)
         * @param {string|object} key or key-value-pairs
         * @param {any} value (only used if key is a string)
         * @returns {any|ShorthandArray} the queried value or the current list
         */
        css(){
            if (arguments.length == 1) {
                // setting multiple values with an object
                if (typeof arguments[0] === 'object') {
                    
                    for (const cssKey in arguments[0]) {
                        this.forEach(elm => elm.style.setProperty(cssKey, arguments[0][cssKey]));
                    }
                    
                    return this;
                
                // querying existing css
                } else if (typeof arguments[0] === 'string') {
                    
                    for (const elm of this) {
                        return elm.style.getPropertyValue(arguments[0]) || null;
                    }
                    
                    return null;
                    
                }
            
            // set single css key-value-pair
            } else if (arguments.length == 2) {
                
                if (typeof arguments[0] === 'string') {
                    this.forEach(elm => elm.style.setProperty(arguments[0], arguments[1]));
                }
                
                return this;
                
            }
        }
        
        /**
         * Get a computed style value from the first element
         * @param {string} cssKey - the CSS key to find
         * @returns {string|any} the computed style value
         */
        style(cssKey){
            for (const elm of this) {
                return getComputedStyle(elm)[cssKey];
            }
            return null;
        }
        
        /**
         * Make these elements visible
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        show(){
            this.forEach(elm => {
                elm.style.setProperty('display', elm.getAttribute('data-temp-display') || '');
                elm.removeAttribute('data-temp-display');
            });
            return this;
        }
        
        /**
         * Make these elements invisible (display: none)
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        hide(){
            this.forEach(elm => {
                if (!elm.hasAttribute('data-temp-display')) {
                    elm.setAttribute('data-temp-display', elm.style.getPropertyValue('display'));
                }
                elm.style.setProperty('display', 'none');
            });
            return this;
        }
        
        /**
         * Loop through every element as a single ShorthandArray
         * @param {function} callback(ShorthandArray) - the function to call
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        each(callback){
            this.map(elm => new ShorthandArray([elm])).forEach(callback);
            return this;
        }
        
        /**
         * Get the first element as a singular ShorthandArray
         * @returns {ShorthandArray}
         */
        first(){
            return new ShorthandArray(this.length > 0 ? [this[0]] : []);
        }
        
        /**
         * Get the last element as a singular ShorthandArray
         * @returns {ShorthandArray}
         */
        last(){
            return new ShorthandArray(this.length > 0 ? [this[this.length-1]] : []);
        }
        
        /**
         * Add an event listener to the elements
         * @param {string} type - the event type to listen to
         * @param {string|function} - the target selector or the callback
         * @param {function} - the callback, if target selector was specified
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        on(){
            if (arguments.length >= 2) {
                
                const eventName = arguments[0];
                const eventTarget = arguments.length > 2 ? arguments[1] : null;
                const eventCallback = arguments[arguments.length-1];
                
                this.forEach(elm => {
                    elm.addEventListener(eventName, (e) => {
                        
                        // if a target selector was specified, check it
                        if (eventTarget) {
                            if (!!e.target.closest(eventTarget)) {
                                eventCallback(e, new ShorthandArray([e.target.closest(eventTarget)]));
                            }
                        
                        // if no target selector was specified
                        } else {
                            eventCallback(e, new ShorthandArray([elm]));
                        }
                        
                    });
                });
                
            } else {
                throw new Error('You need at least two parameters for an event listener.');
            }
            return this;
        }
        
        /**
         * Append one or more elements or strings or html code to these elements
         * @param {...string|...ShorthandArray|...Element} elements - the elements to parse and append
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        append(){
            
            const toAppend = [];
            
            for (const elm of arguments) {
                if (typeof elm === 'string') {
                    toAppend.push(...parseHTML(elm));
                } else if (elm instanceof ShorthandArray) {
                    toAppend.push(...elm);
                } else {
                    toAppend.push(elm);
                }
            }
            
            toAppend.forEach(appendElm => {
                this.forEach(elm => elm.appendChild(appendElm));
            });
            
            return this;
            
        }
        
        /**
         * Prepend one or more elements to the beginning of these elements
         * @param {...string|...ShorthandArray|...Element} elements - the elements to parse and prepend
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        prepend(){
            
            const toPrepend = [];
            
            for (const elm of arguments) {
                if (typeof elm === 'string') {
                    toPrepend.push(...parseHTML(elm));
                } else if (elm instanceof ShorthandArray) {
                    toPrepend.push(...elm);
                } else {
                    toPrepend.push(elm);
                }
            }
            
            toPrepend.forEach(prependElm => {
                this.forEach(elm => elm.insertBefore(prependElm, elm.firstChild));
            });
            
            return this;
            
        }
        
        /**
         * Remove the current elements
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        remove(){
            for (const elm of this) {
                elm.parentNode.removeChild(elm);
            }
            return this;
        }
        
        /**
         * Replace the current elements with other content
         * @returns {ShorthandArray} the current list of elements (to be chained)
         */
        replaceWith(content){
            
            if (content instanceof HTMLElement || content instanceof Node)
                content = $H(content);
            
            if (content instanceof ShorthandArray) 
                content = $H('<div/>').append(content).html();
            
            for (const elm of this) {
                elm.outerHTML = content;
            }
            
            return this;
            
        }
        
        /**
         * Get the computed width of the first element
         * @returns {float} the width (as pixels)
         */
        width(){
            for (const elm of this) {
                return parseFloat(getComputedStyle(elm, null).width.replace('px', ''));
            }
            return null;
        }
        
        /**
         * Get the computed height of the first element
         * @returns {float} the height (as pixels)
         */
        height(){
            for (const elm of this) {
                return parseFloat(getComputedStyle(elm, null).height.replace('px', ''));
            }
            return null;
        }
        
        /**
         * Get the offset of the first element (top and left) as pixels
         * @returns {object} the object containing 'top' and 'left'
         */
        offset(){
            for (const elm of this) {
                const r = elm.getBoundingClientRect();
                return {
                    top: r.top + document.body.scrollTop,
                    left: r.left + document.body.scrollLeft
                };
            }
            return null;
        }
        
        /**
         * Get the position of the element on the page
         * @returns {object} the object containing 'top' and 'left'
         */
        position(){
            for (const elm of this) {
                return {
                    top: elm.offsetTop,
                    left: elm.offsetLeft
                };
            }
            return null;
        }
        
    }
    
    /**
     * @function $H
     * @description This is the main handle of $horthand.
     * @param {string|function|element} content - Pass a CSS selector to query elements,
     *    a html string to create new elements or a function to be called when the DOM has loaded.
     * @returns {ShorthandArray|null} - if you queried something or created new elements,
     *    they will be returned as a ShorthandArray.
     *    All jQuery-like actions happen on it.
     */
    window.$H = function(){
        
        const args = [...arguments];
        const argLen = args.length;
        
        if (argLen == 0) return this;
        
        if (argLen == 1) {
            
            if (typeof args[0] === 'string') {
                
                // query string
                if (!args[0].trim().startsWith('<')) {
                    
                    return new ShorthandArray(document.querySelectorAll(args[0]));
                    
                // HTML element creation
                } else {
                    return parseHTML(args[0]);
                }
                
            } else if (typeof args[0] === 'function') {
                document.addEventListener('DOMContentLoaded', args[0]);
            } else {
                return new ShorthandArray(args);
            }
            
        }
        
    }
    
})();

//
