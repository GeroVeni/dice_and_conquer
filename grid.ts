/** Provides a class for drawing a grid background and individual tiles. */
export class Grid {

    // Properties
    padding: number
    innerLength: number;
    innerX: number;
    innerY: number;
    tileSpacing: number;
    tileSize: number;
    backgroundColor: any;

    /**
     * Creates a Grid object.
     * @param x         The x position of the grid
     * @param y         The y position of the grid.
     * @param length    The length of the grid.
     * @param size      The number of tiles in the grid.
     */
    constructor(public x: number, public y: number, public length: number,
        public size: number, public ctx: CanvasRenderingContext2D) {

        // Inner tile space position information
        this.padding = 10;
        this.innerLength = this.length - 2 * this.padding;
        this.innerX = this.x + this.padding;
        this.innerY = this.y + this.padding;
        this.tileSpacing = 3;
        this.tileSize = (this.innerLength - this.tileSpacing) / this.size - this.tileSpacing;

        // Background color property
        this.backgroundColor = "#eee";
    }

    /**
     * Returns the tile that the mouse is hovering over.
     * @param e         The mousemove event.
     * @param currPhase The current game phase.
     */
    getMouseTile(e: MouseEvent, currPhase: number): { x: number, y: number } {
        if (currPhase !== 1) {
            return { x: -1, y: -1 };
        }
        let pos = { x: e.offsetX - this.innerX, y: e.offsetY - this.innerY };
        if (pos.x < 0 || pos.x > this.innerLength ||
            pos.y < 0 || pos.y > this.innerLength) {
            return { x: -1, y: -1 };
        }
        let span = this.tileSpacing + this.tileSize;
        let mouseTile = {
            x: Math.floor(pos.x / span),
            y: Math.floor(pos.y / span)
        };
        if (mouseTile.x >= this.size) mouseTile.x = this.size - 1;
        if (mouseTile.y >= this.size) mouseTile.y = this.size - 1;
        return mouseTile;
    }

    /**
     * Returns the position (top-left corner) of the tile in the i-th row
     * and j-th column.
     * @param i The row of the tile.
     * @param j The column of the tile.
     */
    getTilePosition(i: number, j: number): { x: number, y: number } {
        return {
            x: this.tileSpacing + this.innerX + j * (this.tileSize + this.tileSpacing),
            y: this.tileSpacing + this.innerY + i * (this.tileSize + this.tileSpacing)
        };
    }

    /**
     * Draws a single tile on the grid.
     * @param i            The row of the tile.
     * @param j            The column of the tile.
     * @param [color=null] The color of the tile. If not specified, it uses the current fillStyle.
     */
    drawTile(i: number, j: number, color: any = null): void {
        if (i < 0 || i >= this.size) return;
        if (j < 0 || j >= this.size) return;
        if (color !== null) {
            this.ctx.fillStyle = color;
        }
        let pos = this.getTilePosition(i, j);
        this.ctx.fillRect(pos.x, pos.y, this.tileSize, this.tileSize);
    }

    /**
     * Function that renders the grid and its tiles
     */
    render(): void {
        // Draw the background
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x, this.y, this.length, this.length);

        // Draw the tiles area
        this.ctx.fillStyle = "#ddd";
        this.ctx.fillRect(this.innerX, this.innerY, this.innerLength, this.innerLength);

        // Draw the individual tiles
        this.ctx.fillStyle = "white";
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.drawTile(i, j);
            }
        }
    }
};