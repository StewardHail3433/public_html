const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]
function make_cell_list() {
    let cells = Array.from(document.getElementById("cell-holder").children);
    let cellBoard = []

    for (let i = 0; i < boardData.cells.length; i++) {
        cellBoard.push(cells.slice(i * boardData.cells.length, i * boardData.cells.length + boardData.cells.length));
    }

    return cellBoard;
}

function showCellData(boardData) {
    for (let i = 0; i < boardData.cells.length; i++) {
        for (let j = 0; j < boardData.cells[i].length; j++) {
            CELLS[i][j].textContent = boardData.cells[i][j];
        }
    }
}

function select(x, y) {
    let cell = CELLS[y][x];
    if (cell.textContent.length > 0) {
        if (selectedCell.x >= 0 && selectedCell.y >= 0) {
            CELLS[selectedCell.y][selectedCell.x].classList.remove("selected");
            console.log("ef")
        }
        cell.classList.add("selected");
        selectedCell.x = x;
        selectedCell.y = y;
    }
}

function unselect(x, y) {
    let cell = CELLS[y][x];
    if (cell.textContent.length > 0) {
        cell.classList.remove("selected");
        selectedCell.x = -1;
        selectedCell.y = -1;
    }
}

function move(x, y) {
    let updatedString = CELLS[selectedCell.y][selectedCell.x].textContent + CELLS[y][x].textContent
    if (updatedString.length > 7) {

        CELLS[selectedCell.y][selectedCell.x].classList.add("error7");
        CELLS[y][x].classList.add("error7");
        setTimeout(() => {
            CELLS[selectedCell.y][selectedCell.x].classList.remove("error7");
            CELLS[y][x].classList.remove("error7");
        }, 1000);
        // Remove the "highlight" class

        CELLS[selectedCell.y][selectedCell.x].classList.remove("selected");
        CELLS[y][x].classList.remove("selected");
        return;
    }
    CELLS[y][x].textContent = updatedString;
    CELLS[selectedCell.y][selectedCell.x].textContent = "";
    select(x, y)

    if (checkForMatch(x, y)) {
        CELLS[y][x].classList.add("matched");
        unselect(x, y)
    } else {
        CELLS[y][x].classList.remove("matched");
    }
}

function canMove(x, y) {

    let isNextTo = Math.abs(selectedCell.x - x) + Math.abs(selectedCell.y - y) == 1;

    return !(selectedCell.x == -1 && selectedCell.y == -1) && !(CELLS[y][x].textContent.length == 0) && isNextTo;
}

function on_click(x, y) {

    if (selectedCell.x == x && selectedCell.y == y) {
        unselect(x, y);
    } else if (canMove(x, y)) {
        move(x, y);
    } else {
        select(x, y);
    }
}

function checkForMatch(x, y) {
    return boardData.words.find(word => word == CELLS[y][x].textContent);
}

function updateWordHeader(words) {
    document.getElementById("words").innerHTML = "WORDS TO FIND:" + words.join(", ");
}

const boardData = boards[Math.floor(Math.random() * 3)];
const CELLS = make_cell_list();
let selectedCell = {
    x: -1,
    y: -1
};
showCellData(boardData);
console.log(CELLS)


updateWordHeader(boardData.words);

function onFrame() {

    requestAnimationFrame(onFrame);
}