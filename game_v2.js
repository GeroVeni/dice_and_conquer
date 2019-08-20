"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
/**********
* Imports *
**********/
var color_1 = require("./color");
var colorscheme_1 = require("./colorscheme");
var grid_1 = require("./grid");
/*******************
* Global variables *
*******************/
var canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.textAlign = "center";
/*********
* Colors *
*********/
var cs = colorscheme_1.ColorScheme.defaultColorScheme();
/******************
* Grid and pieces *
******************/
var grid = new grid_1.Grid(650, 50, 700, 20, ctx);
var pieces = [
    [], []
];
var hoverPiece;
var isHoverValid;
// Add a linear gradient in the background of the grid.
// It starts from the player 0 color at the top left corner
// and ends at the player 1 color at the bottom right corner.
var grad = ctx.createLinearGradient(grid.x, grid.y, grid.x + grid.length, grid.y + grid.length);
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
var currPlayer = 0;
var nameY = 80, nameX1 = 80, nameX2 = 250;
var scoreY = 130;
/*******
* Dice *
*******/
var diceY = 400, diceX1 = 80, diceX2 = 130;
var dice1 = 1, dice2 = 1;
var sideX = dice1, sideY = dice2;
/**
 * 0 -> Roll phase
 * 1 -> Place phase
 */
var currPhase = 0;
var mouseTile = { x: -1, y: -1 };
function randDice() {
    return Math.floor(Math.random() * 6 + 1);
}
function rollDice() {
    if (currPhase === 0) {
        currPhase = 1;
        dice1 = randDice();
        dice2 = randDice();
        sideX = dice1;
        sideY = dice2;
    }
}
function isValid(piece) {
    // Check if inside bounds
    if (piece.left < 0 || piece.right > grid.size)
        return false;
    if (piece.top < 0 || piece.bottom > grid.size)
        return false;
    // Check intersection with pieces
    for (var i = 0; i < pieces.length; i++) {
        for (var j = 0; j < pieces[i].length; j++) {
            if (intersect(pieces[i][j], piece))
                return false;
        }
    }
    // Check piece touches own pieces OR
    // piece is in player corner
    var ownPieces = pieces[piece.player];
    if (ownPieces.length === 0) {
        // Must be in the corner
        var corner = getCorner(piece.player);
        return intersect(corner, piece);
    }
    // Must touch own pieces
    for (var i = 0; i < ownPieces.length; i++) {
        if (touch(ownPieces[i], piece)) {
            return true;
        }
    }
    return false;
}
function makeTilePiece(i, j) {
    return { left: j, top: i, right: j + 1, bottom: i + 1 };
}
function makeHoverPiece() {
    // Find tile bounds
    var offsetX = Math.floor(sideX / 2);
    var offsetY = Math.floor(sideY / 2);
    var piece;
    piece.left = mouseTile.x - offsetX;
    piece.top = mouseTile.y - offsetY;
    piece.right = piece.left + sideX;
    piece.bottom = piece.top + sideY;
    return piece;
}
function newHoverPiece() {
    var d;
    return d;
}
function getCorner(player) {
    switch (player) {
        case 0:
            return makeTilePiece(0, 0);
        case 1:
            return makeTilePiece(grid.size - 1, grid.size - 1);
        default:
            return makeTilePiece(-1, -1);
    }
}
function touch(piece1, piece2) {
    if (piece1.left < piece2.right &&
        piece2.left < piece1.right) {
        return piece1.top === piece2.bottom ||
            piece2.top === piece1.bottom;
    }
    if (piece1.top < piece2.bottom &&
        piece2.top < piece1.bottom) {
        return piece1.left === piece2.right ||
            piece2.left === piece1.right;
    }
    return false;
}
function intersect(piece1, piece2) {
    return (piece1.left < piece2.right &&
        piece2.left < piece1.right &&
        piece1.top < piece2.bottom &&
        piece2.top < piece1.bottom);
}
function init() {
    playerNames.push("George", "John");
    playerScores.push(0, 0);
}
/********************
* Drawing functions *
********************/
function drawPieces() {
    pieces.forEach(function (playerPieces) {
        //playerPieces.forEach(drawPiece)
        for (var i = 0; i < playerPieces.length; i++) {
            drawPiece(playerPieces[i]);
        }
    });
    drawPiece(hoverPiece, true);
}
function drawPiece(piece, hovering) {
    if (hovering === void 0) { hovering = false; }
    var color = new color_1.Color(cs.getPlayerColor(piece.player));
    var errorColor = new color_1.Color("#ccc");
    if (hovering) {
        if (mouseTile.x === -1)
            return;
        // Set hovering color
        color.alpha = 0.5;
        // Check validity
        if (!isHoverValid) {
            color = errorColor;
        }
    }
    for (var i = piece.top; i < piece.bottom; i++) {
        for (var j = piece.left; j < piece.right; j++) {
            grid.drawTile(i, j, color.getColor());
        }
    }
}
function drawPhase() {
    ctx.fillStyle = cs.getPlayerColor(currPlayer);
    var phaseString = 'Roll';
    if (currPhase === 1)
        phaseString = 'Place';
    ctx.fillText(phaseString, 80, 600);
}
function drawScores() {
    ctx.fillStyle = cs.getPlayerColor(0);
    ctx.fillText(playerNames[0], nameX1, nameY);
    ctx.fillText(playerScores[0].toString(), nameX1, scoreY);
    ctx.fillStyle = cs.getPlayerColor(1);
    ctx.fillText(playerNames[1], nameX2, nameY);
    ctx.fillText(playerScores[1].toString(), nameX2, scoreY);
}
function drawDice() {
    ctx.fillStyle = cs.getPlayerColor(currPlayer);
    ctx.fillText(dice1.toString(), diceX1, diceY);
    ctx.fillText(dice2.toString(), diceX2, diceY);
}
/*****************
* Core functions *
*****************/
function update() {
    switch (currPhase) {
        case 0:
            break;
        case 1:
            hoverPiece = makeHoverPiece();
            isHoverValid = isValid(hoverPiece);
            break;
        default:
            var errStr = "An error occuered.";
            console.log(errStr);
            throw errStr;
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
document.addEventListener("keypress", keyPressHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("wheel", wheelHandler, false);
function keyPressHandler(e) {
    switch (e.key) {
        case 'r':
            rollDice();
            break;
        default:
            break;
    }
}
function mouseMoveHandler(e) {
    mouseTile = grid.getMouseTile(e, currPhase);
}
function mouseDownHandler(e) {
    // Check if left mouse button was pressed
    if (e.buttons !== 1)
        return;
    switch (currPhase) {
        case 0:
            break;
        case 1:
            // Check if position of hovering piece is valid
            if (!isHoverValid)
                return;
            pieces[currPlayer].push(hoverPiece);
            playerScores[currPlayer] += dice1 * dice2;
            hoverPiece = newHoverPiece();
            currPhase = 0;
            currPlayer = (currPlayer + 1) % 2;
            break;
        default:
            break;
    }
}
function wheelHandler() {
    // Check that we are in the placing phace
    if (currPhase !== 1)
        return;
    var tmp = sideX;
    sideX = sideY;
    sideY = tmp;
}
/***************
* Main program *
***************/
var FPS = 30;
init();
var interval = setInterval(mainLoop, 1000 / FPS);
//# sourceMappingURL=game_v2.js.map