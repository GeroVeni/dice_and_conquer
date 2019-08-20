import { Utilities as ut} from "./utilities";

/** A color wrapper that allows for dynamic variation of individual color components. */
export class Color {

    // Properties
    red: number;
    green: number;
    blue: number;
    alpha: number;

    /**
     * Creates a Color object.
     * @param colorVal The hexadecimal form of the color. 
     *     If the value is three digits, it is interpreted as #RGB.
     *     If the value is six digits, it is interpreted as #RRGGBB.
     *     If the value is eight digits, it is interpreted as #RRGGBBAA.
     */
    constructor(colorVal: string) {
        // Validate input
        if (colorVal[0] !== '#') {
            throw "Color class: invalid argument in constructor.";
        }
        if (colorVal.length !== 4 &&
            colorVal.length !== 7 &&
            colorVal.length !== 9) {
            throw "Color class: invalid argument in constructor.";
        }
        for (let i = 1; i < colorVal.length; i++) {
            if (!ut.isHexChar(colorVal[i])) {
                throw "Color class: invalid argument in constructor.";
            }
        }

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 1;

        if (colorVal.length === 4) {
            // #RGB form
            this.red = ut.getStrHexValue(colorVal.substr(1, 1));
            this.green = ut.getStrHexValue(colorVal.substr(2, 1));
            this.blue = ut.getStrHexValue(colorVal.substr(3, 1));
        }
        else if (colorVal.length === 7) {
            // #RRGGBB form
            this.red = ut.getStrHexValue(colorVal.substr(1, 2));
            this.green = ut.getStrHexValue(colorVal.substr(3, 2));
            this.blue = ut.getStrHexValue(colorVal.substr(5, 2));
        }
        else {
            // #RRGGBBAA form
            this.red = ut.getStrHexValue(colorVal.substr(1, 2));
            this.green = ut.getStrHexValue(colorVal.substr(3, 2));
            this.blue = ut.getStrHexValue(colorVal.substr(5, 2));
            this.alpha = ut.getStrHexValue(colorVal.substr(7, 2)) / 255;
        }
    }

    /**
     * Returns a string representation of the color.
     */
    getColor(): string {
        return "rgba(" +
            this.red + "," +
            this.green + "," +
            this.blue + "," +
            this.alpha + ")";
    }

};

