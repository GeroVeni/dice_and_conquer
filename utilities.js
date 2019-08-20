"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Provides utility functions. */
var Utilities = /** @class */ (function () {
    function Utilities() {
    }
    /**
     * Returns whether a character can be interpreted as a hexadecimal digit.
     * @param ch The character to be interpreted.
     */
    Utilities.isHexChar = function (ch) {
        var chCode = ch.charCodeAt(0);
        var loNum = '0'.charCodeAt(0);
        var hiNum = '9'.charCodeAt(0);
        var loLowCase = 'a'.charCodeAt(0);
        var hiLowCase = 'f'.charCodeAt(0);
        var loUpCase = 'A'.charCodeAt(0);
        var hiUpCase = 'F'.charCodeAt(0);
        return (loNum <= chCode && chCode <= hiNum) ||
            (loLowCase <= chCode && chCode <= hiLowCase) ||
            (loUpCase <= chCode && chCode <= hiUpCase);
    };
    /**
     * Returns the value of a character interpreted as a hexadecimal value.
     * @param ch The characted to be interpreted.
     * @example "e" is 14.
     */
    Utilities.getCharHexValue = function (ch) {
        var dig = ch.charCodeAt(0);
        var loNum = '0'.charCodeAt(0);
        var hiNum = '9'.charCodeAt(0);
        if (loNum <= dig && dig <= hiNum) {
            return dig - loNum;
        }
        var loLowCase = 'a'.charCodeAt(0);
        var hiLowCase = 'f'.charCodeAt(0);
        if (loLowCase <= dig && dig <= hiLowCase) {
            return 10 + dig - loLowCase;
        }
        var loUpCase = 'A'.charCodeAt(0);
        var hiUpCase = 'F'.charCodeAt(0);
        return 10 + dig - loUpCase;
    };
    /**
     * Returns the value of a string interpreted as a hexadecimal value.
     * @param str The string to be interpreted.
     * @example "ff" is 255, "f" is 255 and "0f" is 15.
     */
    Utilities.getStrHexValue = function (str) {
        if (str.length === 1) {
            return 17 * this.getCharHexValue(str);
        }
        return 16 * this.getCharHexValue(str[0]) + this.getCharHexValue(str[1]);
    };
    return Utilities;
}());
exports.Utilities = Utilities;
//# sourceMappingURL=utilities.js.map