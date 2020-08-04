/**
 * Ensures that the stated arguments are present.
 * @param {...(NodeList|HTMLCollection|HTML element|string|Array)} args
 *    Arguments to be checked.
 */
function ensureNonNull() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    /**
     * Indicates error type.
     * @enum {string}
     */
    var ErrorType;
    (function (ErrorType) {
        ErrorType["NULL_VALUE"] = "Null value";
        ErrorType["EMPTY_STR"] = "Empty string";
        ErrorType["EMPTY_COLL_OR_LIST"] = "Empty HTMLCollection/NodeList";
        ErrorType["EMPTY_ARR"] = "Empty array";
    })(ErrorType || (ErrorType = {}));
    ;
    var hasError = false;
    /** @type {ErrorType} The type of error, if any. */
    var err = null;
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
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
    console.assert(!hasError, "Missing desired element: " + err);
}
