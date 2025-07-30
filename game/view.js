const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const BOARD_THICKNESS = 25;
const CELL_WIDTH = (CANVAS.width/3) - BOARD_THICKNESS/2
const CELL_HEIGHT = (CANVAS.height/3) - BOARD_THICKNESS/2
function drawRect(x, y, width, height, color) {
    CONTEXT.fillStyle = color;
    CONTEXT.fillRect(x, y, width, height);  
}

function drawBoard() {
    drawRect(0,0, CANVAS.width, CANVAS.height, "rgba(0,0,0,0.25");
    for(let i = 1; i <= 2; i++) {
        drawRect((CANVAS.width/3)*i - BOARD_THICKNESS/2, 0, BOARD_THICKNESS, CANVAS.height, "white");
    }

    for(let i = 1; i <= 2; i++) {
        drawRect(0, (CANVAS.height/3)*i - BOARD_THICKNESS/2, CANVAS.width, BOARD_THICKNESS, "white");
    }
}

function drawCircle(x, y, radius, thickness, color) {
    CONTEXT.fillStyle = color;
    CONTEXT.lineWidth = thickness;
    CONTEXT.beginPath();
    CONTEXT.arc(x, y, radius, 0, Math.PI * 2);
}

function drawX(x, y, thickness, color) {
    CONTEXT.fillStyle = color;
    CONTEXT.lineWidth = thickness;
    CONTEXT.beginPath();
    CONTEXT.moveTo(x-CELL_WIDTH/2, y-CELL_HEIGHT/2);
    CONTEXT.lineTo(x+CELL_WIDTH/2, y+CELL_HEIGHT/2);
    CONTEXT.moveTo(x+CELL_WIDTH/2, y-CELL_HEIGHT/2);
    CONTEXT.lineTo(x-CELL_WIDTH/2, y+CELL_HEIGHT/2);
    CONTEXT.stroke();
}

function drawGame(board) {
    drawBoard();
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            const cell = board[i][j];
            if(cell == "x") {
                drawX((CANVAS.width/3)*j - BOARD_THICKNESS/2 + CANVAS.width/6, (CANVAS.height/3)*i - BOARD_THICKNESS/2 + CANVAS.height/6, 5, "red");
            }
            else if(cell == "o") {
                drawCircle((CANVAS.width/3)*j - BOARD_THICKNESS/2 + CANVAS.width/6, (CANVAS.height/3)*i - BOARD_THICKNESS/2 + CANVAS.height/6, 5, "red");
            }
        }
    }
}


export default {
    drawGame
}