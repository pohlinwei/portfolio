"use strict";
/**
 * Ensures that the stated arguments are present.
 * @param {...(NodeList|HTMLCollection|HTML element|string|Array)} args
 *    Arguments to be checked.
 */
function ensureNonNull(...args) {
    /**
     * Indicates error type.
     * @enum {string}
     */
    let ErrorType;
    (function (ErrorType) {
        ErrorType["NULL_VALUE"] = "Null value";
        ErrorType["EMPTY_STR"] = "Empty string";
        ErrorType["EMPTY_COLL_OR_LIST"] = "Empty HTMLCollection/NodeList";
        ErrorType["EMPTY_ARR"] = "Empty array";
    })(ErrorType || (ErrorType = {}));
    ;
    let hasError = false;
    /** @type {ErrorType} The type of error, if any. */
    let err = null;
    for (let arg of args) {
        if (arg === null) {
            err = ErrorType.NULL_VALUE;
        }
        else if (typeof arg === 'string' && arg === '') {
            err = ErrorType.EMPTY_STR;
        }
        else if ((arg instanceof HTMLCollection || arg instanceof NodeList) &&
            arg.length === 0) {
            err = ErrorType.EMPTY_COLL_OR_LIST;
        }
        else if (Array.isArray(arg) && arg.length === 0) {
            err = ErrorType.EMPTY_ARR;
        }
        hasError = err !== null;
        if (hasError) {
            break;
        }
    }
    console.assert(!hasError, `Missing desired element: ${err}`);
}
const ensureNonNegative = (...nums) => nums.forEach(num => console.assert(num >= 0, 'Given number should not be negative'));
var Display;
(function (Display) {
    Display["HIDE"] = "none";
    Display["SHOW"] = "flex";
})(Display || (Display = {}));
;
/** Converts seconds to milliseconds. */
const toMilliseconds = (seconds) => seconds * 1000;
