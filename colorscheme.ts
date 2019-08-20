/** Provides the application with a consistent color scheme. */
export class ColorScheme {

    // Properties
    playerColors: any[];

    /** Creates a ColorScheme object. */
    constructor() {
        this.playerColors = [];
    }

    /**
     * Adds player colors to the color scheme.
     * @param normalColor   The normal color variant of the player color.
     * @param darkColor     The dark color variant of the player color.
     */
    addPlayerColor(normalColor: string, darkColor: string): void {
        this.playerColors.push({ normal: normalColor, dark: darkColor });
    }

    /**
     * Returns the player color from the color scheme.
     * @param index The player index.
     * @param mode  Specifies the color variation. 0 means normal, 1 means dark.
     */
    getPlayerColor(index: number, mode: number = 0): string {
        let l = this.playerColors.length;
        if (l < 1) {
            return "#1590d5";
        }
        let color = this.playerColors[index % l];
        if (mode === 1) {
            return color.dark;
        }
        return color.normal;
    }

    /**
     * Returns the default ColorScheme.
     */
    static defaultColorScheme(): ColorScheme {
        let cs = new ColorScheme();
        cs.addPlayerColor("#d064d4", "#58285c");
        cs.addPlayerColor("#ff696a", "#6f2325");
        return cs;
    }
};