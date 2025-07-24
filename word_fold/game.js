const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]
        ],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]
        ],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]
        ],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
    // New boards
    {
        cells: [
            ["M", "A", "S", "K", "E"],
            ["T", "A", "C", "S", "O"],
            ["E", "N", "T", "A", "S", "I"],
            ["C", "K", "T", "B", "M"],
            ["H", "S", "L", "I", "N"]
        ],
        words: ["MASK", "EAST", "COKE", "SALT", "TACK"]
    },
    {
        cells: [
            ["V", "O", "L", "I", "R"],
            ["T", "F", "A", "P", "D"],
            ["O", "N", "I", "C", "R"],
            ["V", "O", "L", "T", "I"],
            ["R", "F", "N", "O", "P"]
        ],
        words: ["VOLT", "CORN", "POND", "FIRE", "LIFT"]
    },
    {
        cells: [
            ["G", "R", "A", "P", "E"],
            ["B", "S", "M", "O", "N"],
            ["G", "O", "P", "E", "R"],
            ["T", "R", "A", "N", "S"],
            ["P", "S", "L", "A", "C"]
        ],
        words: ["GRAPE", "MONS", "PER", "GRASP", "LACE"]
    },
    {
        cells: [
            ["P", "O", "L", "A", "R"],
            ["A", "E", "S", "O", "M"],
            ["R", "I", "O", "P", "H"],
            ["O", "D", "L", "T", "F"],
            ["R", "S", "A", "M", "I"]
        ],
        words: ["POLAR", "MAST", "FIRE", "TIDE", "SUM"]
    }
];
function make_cell_list() {
    let cellHolders = Array.from(document.getElementsByClassName("cell-holder"));
    let cellBoards = {
        top: [],
        bottom: [],
        left: [],
        right: [],
        front: [],
        back: [],
    }

    for (let i = 0; i < cellHolders.length; i++) {
        let cells = Array.from(cellHolders[i].children)
        for (let j = 0; j < boardData.top.cells.length; j++) {
            if(cellHolders[i].parentElement.classList.contains("top")) {
                cellBoards.top.push(cells.slice(j * boardData.top.cells.length, j * boardData.top.cells.length + boardData.top.cells.length));   
            } else if(cellHolders[i].parentElement.classList.contains("bottom")) {
                cellBoards.bottom.push(cells.slice(j * boardData.bottom.cells.length, j * boardData.bottom.cells.length + boardData.bottom.cells.length));   
            } else if (cellHolders[i].parentElement.classList.contains("front")) {
                cellBoards.front.push(cells.slice(j * boardData.front.cells.length, j * boardData.front.cells.length + boardData.front.cells.length));
            } else if (cellHolders[i].parentElement.classList.contains("back")) {
                cellBoards.back.push(cells.slice(j * boardData.back.cells.length, j * boardData.back.cells.length + boardData.back.cells.length));
            } else if (cellHolders[i].parentElement.classList.contains("left")) {
                cellBoards.left.push(cells.slice(j * boardData.left.cells.length, j * boardData.left.cells.length + boardData.left.cells.length));
            } else if (cellHolders[i].parentElement.classList.contains("right")) {
                cellBoards.right.push(cells.slice(j * boardData.right.cells.length, j * boardData.right.cells.length + boardData.right.cells.length));
            }
        }
    }

    
    return cellBoards;
}

function showCellData() {
    console.log(CELLS);
    let faces = Object.keys(boardData);
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        console.log(face);
        for (let j = 0; j < boardData[face].cells.length; j++) {
            for (let l = 0; l < boardData[face].cells[j].length; l++) {
                console.log(CELLS[face][j][l]);
                CELLS[face][j][l].textContent = boardData[face].cells[j][l];
            }
        }
    }
}

function select(face, x, y) {
    let cell = CELLS[face][y][x];
    if (cell.textContent.length > 0) {
        if (selectedCell.x >= 0 && selectedCell.y >= 0 && selectedCell.face != "none") {
            CELLS[selectedCell.face][selectedCell.y][selectedCell.x].classList.remove("selected");
            console.log("ef")
        }
        cell.classList.add("selected");
        selectedCell.x = x;
        selectedCell.y = y;
        selectedCell.face = face;
    }
}

function unselect(face, x, y) {
    let cell = CELLS[face][y][x];
    if (cell.textContent.length > 0) {
        cell.classList.remove("selected");
        selectedCell.x = -1;
        selectedCell.y = -1;
        selectedCell.face = "none";
    }
}

function move(face, x, y) {
    let updatedString = CELLS[face][selectedCell.y][selectedCell.x].textContent + CELLS[face][y][x].textContent
    if (updatedString.length > 7) {

        CELLS[face][selectedCell.y][selectedCell.x].classList.add("error7");
        CELLS[face][y][x].classList.add("error7");
        setTimeout(() => {
            CELLS[face][selectedCell.y][selectedCell.x].classList.remove("error7");
            CELLS[face][y][x].classList.remove("error7");
        }, 1000);
        // Remove the "highlight" class

        CELLS[face][selectedCell.y][selectedCell.x].classList.remove("selected");
        CELLS[face][y][x].classList.remove("selected");
        return;
    }
    CELLS[face][y][x].textContent = updatedString;
    CELLS[selectedCell.face][selectedCell.y][selectedCell.x].textContent = "";
    CELLS[selectedCell.face][selectedCell.y][selectedCell.x].classList.remove("selected");
    select(face, x, y)

    if (checkForMatch(face, x, y)) {
        CELLS[face][y][x].classList.add("matched");
        unselect(face, x, y)
    } else {
        CELLS[face][y][x].classList.remove("matched");
    }
}

function canMove(face, x, y) {

    let isNextTo = Math.abs(selectedCell.x - x) + Math.abs(selectedCell.y - y) == 1;

    return !(selectedCell.x == -1 && selectedCell.y == -1) && !(CELLS[face][y][x].textContent.length == 0) && isNextTo;
}

function on_click(face, x, y) {

    if (selectedCell.x == x && selectedCell.y == y) {
        unselect(face, x, y);
    } else if (canMove(face, x, y)) {
        move(face, x, y);
    } else {
        select(face, x, y);
    }
}

function checkForMatch(face, x, y) {
    return boardData[face].words.find(word => word == CELLS[face][y][x].textContent);
}

function updateWordHeader() {
    let faces = Object.keys(boardData);

    for(let i = 0; i < faces.length; i++) {
        document.getElementById("words").innerHTML = "<p style='color: '" + CELLS[faces[i]][0][0].parentElement.style.backgroundColor + "'>" + faces[i] + ";>WORDS TO FIND:" + boardData[faces].words.join(", ") + "</p>";
    }
}

const boardData = {top:boards[Math.floor(Math.random() * 6)], bottom:boards[Math.floor(Math.random() * 6)], left:boards[Math.floor(Math.random() * 3)], right:boards[Math.floor(Math.random() * 3)], front:boards[Math.floor(Math.random() * 3)], back:boards[Math.floor(Math.random() * 3)]};
const CELLS = make_cell_list();
let selectedCell = {
    x: -1,
    y: -1,
    face: "none"
};
showCellData(boardData);
console.log(CELLS)


// updateWordHeader(boardData);
let angle = 0;

function onFrame() {
    angle += 0.213;
    document.body.style.setProperty("--angle", angle + "deg");
    requestAnimationFrame(onFrame);
}
requestAnimationFrame(onFrame);