/** Provides utility functions. */
export class Utilities {
    /**
     * Returns whether a character can be interpreted as a hexadecimal digit.
     * @param ch The character to be interpreted.
     */
    static isHexChar(ch: string): boolean {
        let chCode = ch.charCodeAt(0);

        let loNum = '0'.charCodeAt(0);
        let hiNum = '9'.charCodeAt(0);

        let loLowCase = 'a'.charCodeAt(0);
        let hiLowCase = 'f'.charCodeAt(0);

        let loUpCase = 'A'.charCodeAt(0);
        let hiUpCase = 'F'.charCodeAt(0);

        return (loNum <= chCode && chCode <= hiNum) ||
            (loLowCase <= chCode && chCode <= hiLowCase) ||
            (loUpCase <= chCode && chCode <= hiUpCase);
    }

    /**
     * Returns the value of a character interpreted as a hexadecimal value.
     * @param ch The characted to be interpreted.
     * @example "e" is 14.
     */
    static getCharHexValue(ch: string): number{
        let dig = ch.charCodeAt(0);

        let loNum = '0'.charCodeAt(0);
        let hiNum = '9'.charCodeAt(0);
        if (loNum <= dig && dig <= hiNum) {
            return dig - loNum;
        }

        let loLowCase = 'a'.charCodeAt(0);
        let hiLowCase = 'f'.charCodeAt(0);
        if (loLowCase <= dig && dig <= hiLowCase) {
            return 10 + dig - loLowCase;
        }

        let loUpCase = 'A'.charCodeAt(0);
        let hiUpCase = 'F'.charCodeAt(0);
        return 10 + dig - loUpCase;
    }

    /**
     * Returns the value of a string interpreted as a hexadecimal value.
     * @param str The string to be interpreted.
     * @example "ff" is 255, "f" is 255 and "0f" is 15.
     */
    static getStrHexValue(str: string): number {
        if (str.length === 1) {
            return 17 * this.getCharHexValue(str);
        }
        return 16 * this.getCharHexValue(str[0]) + this.getCharHexValue(str[1]);
    }
}