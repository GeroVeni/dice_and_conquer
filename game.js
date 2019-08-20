/*******************
* Global variables *
*******************/
var canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.textAlign = "center";

/********************
* Utility functions *
********************/
function isHexChar(ch) {
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

function getCharHexValue(ch) {
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

function getStrHexValue(str) {
    if (str.length === 1) {
        let dig = str.charCodeAt(0);
        return 17 * getCharHexValue(str);
    }
    return 16 * getCharHexValue(str[0]) + getCharHexValue(str[1]);
}

/**********
* Classes *
**********/
class Color {
    /**
     * Creates a Color object
     * @param {string} colorVal     The hexadecimal form of the color.
     *     If the value is three digits, it is interpreted as #RGB.
     *     If the value is six digits, it is interpreted as #RRGGBB.
     *     If the value is eight digits, it is interpreted as #RRGGBBAA.
     */
    constructor(colorVal) {
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
            if (!isHexChar(colorVal[i])) {
                throw "Color class: invalid argument in constructor.";
            }
        }

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 1;

        if (colorVal.length === 4) {
            // #RGB form
            this.red = getStrHexValue(colorVal.substr(1, 1));
            this.green = getStrHexValue(colorVal.substr(2, 1));
            this.blue = getStrHexValue(colorVal.substr(3, 1));
        }
        else if (colorVal.length === 7) {
            // #RRGGBB form
            this.red = getStrHexValue(colorVal.substr(1, 2));
            this.green = getStrHexValue(colorVal.substr(3, 2));
            this.blue = getStrHexValue(colorVal.substr(5, 2));
        }
        else {
            // #RRGGBBAA form
            this.red = getStrHexValue(colorVal.substr(1, 2));
            this.green = getStrHexValue(colorVal.substr(3, 2));
            this.blue = getStrHexValue(colorVal.substr(5, 2));
            this.alpha = getStrHexValue(colorVal.substr(7, 2)) / 255;
        }
    }

    /**
     * Returns a string representation of the color.
     */
    getColor() {
        return "rgba(" +
            this.red + "," +
            this.green + "," +
            this.blue + "," +
            this.alpha + ")";
    }

};

class ColorScheme {
    constructor () {
        this.playerColors = [];
    }
    addPlayerColor(normalColor, darkColor) {
        this.playerColors.push({normal: normalColor, dark: darkColor});
    }
    /*
     * Returns the player color from the color scheme.
     * @param {number} index    The player index.
     * @param {number} mode     Specifies the color variation. 0 means normal, 1 means dark.
     */
    getPlayerColor(index, mode = 0) {
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
    static defaultColorScheme() {
        let cs = new ColorScheme();
        cs.addPlayerColor("#d064d4", "#58285c");
        cs.addPlayerColor("#ff696a", "#6f2325");
        return cs;
    }
};

class Grid {
    constructor (x, y, length, size) {
        // General position information
        this.x = x;
        this.y = y;
        this.length = length;

        // Number of tiles in the grid
        this.size = size;
        
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

    /*
     * Returns the tile that the mouse is hovering over.
     * @param {object} e    The mousemove event.
     */
    getMouseTile(e) {
        if (currPhase !== 1) {
            return {x:-1, y:-1};
        }
        let pos = {x:e.offsetX - this.innerX, y:e.offsetY - this.innerY};
        if (pos.x < 0 || pos.x > this.innerLength ||
            pos.y < 0 || pos.y > this.innerLength) {
            return {x:-1, y:-1};
        }
        let span = this.tileSpacing + this.tileSize;
        mouseTile = {
            x:Math.floor(pos.x / span),
            y:Math.floor(pos.y / span)
        };
        if (mouseTile.x >= this.size) mouseTile.x = this.size - 1;
        if (mouseTile.y >= this.size) mouseTile.y = this.size - 1;
        return mouseTile;
    }

    /*
     * Returns the position (top-left corner) of the tile in the i-th row
     * and j-th column.
     * @param {number} i    The row of the tile.
     * @param {number} j    The column of the tile.
     */
    getTilePosition(i, j) {
        return {
            x:this.tileSpacing + this.innerX + j * (this.tileSize + this.tileSpacing),
            y:this.tileSpacing + this.innerY + i * (this.tileSize + this.tileSpacing)};
    }
   
    /*
     * Draws a single tile on the grid.
     * @param {number} i                The row of the tile.
     * @param {number} j                The column of the tile.
     * @param {string} [color=null]     The color of the tile. If not specified,
     *                                  it uses the current fillStyle.
     */
    drawTile(i, j, color = null) {
        if (i < 0 || i >= this.size) return;
        if (j < 0 || j >= this.size) return;
        if (color !== null) {
            ctx.fillStyle = color;
        }
        let pos = this.getTilePosition(i, j);
        ctx.fillRect(pos.x, pos.y, this.tileSize, this.tileSize);
    }

    /*
     * Function that renders the grid and its tiles
     */
    render() {
        // Draw the background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.length, this.length);
        // Draw the tiles area
        ctx.fillStyle = "#ddd";
        ctx.fillRect(this.innerX, this.innerY, this.innerLength, this.innerLength);
        // Draw the individual tiles
        ctx.fillStyle = "white";
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.drawTile(i, j);
            }
        }
    }
};

/*********
* Colors *
*********/
let cs = ColorScheme.defaultColorScheme();

/******************
* Grid and pieces *
******************/
var grid = new Grid(650, 50, 700, 20);
var pieces = [
    [
        //{player:0, startX:0, startY:0, endX:3, endY:5}
    ],[
        //{player:1, startX:16, startY:16, endX:20, endY:20}
    ]
];
var hoveringPiece = newHoveringPiece();
// Add a linear gradient in the background of the grid.
// It starts from the player 0 color at the top left corner
// and ends at the player 1 color at the bottom right corner.
let grad = ctx.createLinearGradient(grid.x, grid.y, grid.x + grid.length, grid.y + grid.length);
grad.addColorStop(0, cs.getPlayerColor(0));
grad.addColorStop(0.48, cs.getPlayerColor(0));
grad.addColorStop(0.52, cs.getPlayerColor(1));
grad.addColorStop(1, cs.getPlayerColor(1));
grid.backgroundColor = grad;

/*********************
* Players and scores *
*********************/
var playerNames = [];
var playerScores = [];
let currPlayer = 0;
let nameY = 80, nameX1 = 80, nameX2 = 250;
let scoreY = 130;

/*******
* Dice *
*******/
let diceY = 400, diceX1 = 80, diceX2 = 130;
let dice1 = 1, dice2 = 1;

/*
 * 0 -> Roll phase
 * 1 -> Place phase
 */
let currPhase = 0;
let mouseTile = {x: -1, y: -1};

function randDice() {
    return Math.floor(Math.random() * 6 + 1);
}

function rollDice() {
    if (currPhase === 0) {
        currPhase = 1;
        dice1 = randDice();
        dice2 = randDice();
        hoveringPiece = {
            player: currPlayer,
            sideX: dice1,
            sideY: dice2
        };
    }
}

function isValid(piece) {
    // Check if inside bounds
    if (piece.startX < 0 || piece.endX > grid.size) return false;
    if (piece.startY < 0 || piece.endY > grid.size) return false;

    // Check intersection with pieces
    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < pieces[i].length; j++) {
            if (intersect(pieces[i][j], piece)) return false;
        }
    }

    // Check piece touches own pieces OR
    // piece is in player corner
    ownPieces = pieces[piece.player];
    if (ownPieces.length === 0) {
        // Must be in the corner
        let corner = getCorner(piece.player);
        return intersect(corner, piece);
    }
    // Must touch own pieces
    for (let i = 0; i < ownPieces.length; i++) {
        if (touch(ownPieces[i], piece)) {
            return true;
        }
    }
    return false;
}

function makeTilePiece(i, j) {
    return {startX:j, startY:i, endX:j+1, endY:i+1};
}

function makeHoverPiece(piece) {
        // Find tile bounds
        let offsetX = Math.floor(piece.sideX / 2);
        let offsetY = Math.floor(piece.sideY / 2);
        piece.startX = mouseTile.x - offsetX;
        piece.startY = mouseTile.y - offsetY;
        piece.endX = piece.startX + piece.sideX;
        piece.endY = piece.startY + piece.sideY;
}

function newHoveringPiece() {
    return {
        player: 0,
        sideX: 0,
        sideY: 0,
        isValid: false
    };
}

function getCorner(player) {
    switch (player) {
        case 0:
            return makeTilePiece(0, 0);
        case 1:
            return makeTilePiece(grid.size-1, grid.size-1);
        default:
            return makeTilePiece(-1, -1);
    }
}

function touch(piece1, piece2) {
    if (piece1.startX < piece2.endX &&
        piece2.startX < piece1.endX) {
        return piece1.startY === piece2.endY ||
            piece2.startY === piece1.endY;
    }
    if (piece1.startY < piece2.endY &&
        piece2.startY < piece1.endY) {
        return piece1.startX === piece2.endX ||
            piece2.startX === piece1.endX;
    }
    return false;
}

function intersect(piece1, piece2) {
    return (
        piece1.startX < piece2.endX && 
        piece2.startX < piece1.endX &&
        piece1.startY < piece2.endY &&
        piece2.startY < piece1.endY
    );
}

function init() {
    playerNames.push("George", "John");
    playerScores.push(0, 0);
}

/********************
* Drawing functions *
********************/
function drawPieces() {
    pieces.forEach(playerPieces => {
        playerPieces.forEach(drawPiece)
        for (let i = 0; i < playerPieces.length; i++) {
            drawPiece(playerPieces[i]);
        }
    });
    drawPiece(hoveringPiece, true);
}

function drawPiece(piece, hovering = false) {
    let color = new Color(cs.getPlayerColor(piece.player));
    let errorColor = new Color("#ccc");
    if (hovering) {
        if (mouseTile.x === -1) return;

        // Set hovering color
        color.alpha = 0.5;

        // Check validity
        if (!piece.isValid) {
            color = errorColor;
        }
    }
    for (let i = piece.startY; i < piece.endY; i++) {
        for (let j = piece.startX; j < piece.endX; j++) {
            grid.drawTile(i, j, color.getColor());
        }
    }
}

function drawPhase() {
    ctx.fillStyle = cs.getPlayerColor(currPlayer);
    let phaseString = 'Roll';
    if (currPhase === 1) phaseString = 'Place';
    ctx.fillText(phaseString, 80, 600);
}

function drawScores() {
    ctx.fillStyle = cs.getPlayerColor(0);
    ctx.fillText(playerNames[0], nameX1, nameY);
    ctx.fillText(playerScores[0], nameX1, scoreY);
    ctx.fillStyle = cs.getPlayerColor(1);
    ctx.fillText(playerNames[1], nameX2, nameY);
    ctx.fillText(playerScores[1], nameX2, scoreY);
}

function drawDice() {
    ctx.fillStyle = cs.getPlayerColor(currPlayer);
    ctx.fillText(dice1, diceX1, diceY);
    ctx.fillText(dice2, diceX2, diceY);
}

/*****************
* Core functions *
*****************/
function update() {
    switch (currPhase) {
        case 0:
            break;
        case 1:
            
            makeHoverPiece(hoveringPiece);
            hoveringPiece.isValid = isValid(hoveringPiece);
            break;
        default:
            let errStr = "An error occuered.";
            console.log(errStr);
            throw errStr;
            break;
    }
}

function render() {
    ctx.fillStyle = "#231f20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPhase();
    drawScores();
    drawDice();
    grid.render();
    drawPieces();
}

function mainLoop() {
    update();
    render();
}

/*****************
* Event handlers *
*****************/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", keyPressHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("wheel", wheelHandler, false);

function keyDownHandler(e) {
    if (e.key == "d") {
        rightPressed = true;
    } else if (e.key == "a") {
        leftPressed = true;
    }
}

function keyPressHandler(e) {
    switch (e.key) {
        case 'd':
            playerScores[0] += 50;
            break;
        case 'a':
            playerScores[0] -= 50;
            break;
        case 'r':
            rollDice();
            break;
        default:
            break;
    }
}

function keyUpHandler(e) {
    if (e.key == "d") {
        rightPressed = false;
    } else if (e.key == "a") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    mouseTile = grid.getMouseTile(e);
}

function mouseDownHandler(e) {
    // Check if left mouse button was pressed
    if (e.buttons !== 1) return;
    switch (currPhase) {
        case 0:
            break;
        case 1:
            // Check if position of hovering piece is valid
            if (!hoveringPiece.isValid) return;
            pieces[currPlayer].push(hoveringPiece);
            playerScores[currPlayer] += dice1 * dice2;
            hoveringPiece = newHoveringPiece();
            currPhase = 0;
            currPlayer = (currPlayer + 1) % 2;
            break;
        default:
            break;
    }
}

function wheelHandler(e) {
    // Check that we are in the placing phace
    if (currPhase !== 1) return;
    var tmp = hoveringPiece.sideX;
    hoveringPiece.sideX = hoveringPiece.sideY;
    hoveringPiece.sideY = tmp;
}

/***************
* Main program *
***************/
let FPS = 30;
init();
var interval = setInterval(mainLoop, 1000/FPS);

