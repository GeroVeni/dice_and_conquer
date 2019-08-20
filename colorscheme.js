"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Provides the application with a consistent color scheme. */
var ColorScheme = /** @class */ (function () {
    /** Creates a ColorScheme object. */
    function ColorScheme() {
        this.playerColors = [];
    }
    /**
     * Adds player colors to the color scheme.
     * @param normalColor   The normal color variant of the player color.
     * @param darkColor     The dark color variant of the player color.
     */
    ColorScheme.prototype.addPlayerColor = function (normalColor, darkColor) {
        this.playerColors.push({ normal: normalColor, dark: darkColor });
    };
    /**
     * Returns the player color from the color scheme.
     * @param index The player index.
     * @param mode  Specifies the color variation. 0 means normal, 1 means dark.
     */
    ColorScheme.prototype.getPlayerColor = function (index, mode) {
        if (mode === void 0) { mode = 0; }
        var l = this.playerColors.length;
        if (l < 1) {
            return "#1590d5";
        }
        var color = this.playerColors[index % l];
        if (mode === 1) {
            return color.dark;
        }
        return color.normal;
    };
    /**
     * Returns the default ColorScheme.
     */
    ColorScheme.defaultColorScheme = function () {
        var cs = new ColorScheme();
        cs.addPlayerColor("#d064d4", "#58285c");
        cs.addPlayerColor("#ff696a", "#6f2325");
        return cs;
    };
    return ColorScheme;
}());
exports.ColorScheme = ColorScheme;
;
//# sourceMappingURL=colorscheme.js.map