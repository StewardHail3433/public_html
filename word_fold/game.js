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
    console.log(cells[0].parentElement.background)
    }

    
    return cellBoards;
}

function showCellData() {
    let faces = Object.keys(boardData);
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        for (let j = 0; j < boardData[face].cells.length; j++) {
            for (let l = 0; l < boardData[face].cells[j].length; l++) {
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
        const myStylesheet = document.styleSheets[0]; 

        // Get the list of CSS rules
        const ruleList = myStylesheet.cssRules; 

        // Loop through the rules and find the one for the ".top" class
        for (const rule of ruleList) {
            if (rule.selectorText === "." + faces[i]) {
                // Found the rule, you can now access its properties
                color = rule.style.cssText.substring(rule.style.cssText.search("rgba"));

            }
        }
        document.getElementById("words").innerHTML += "<p style='color: " + color + "'>" + faces[i] + "-- WORDS TO FIND:" + boardData[faces[i]].words.join(", ") + "</p>";
    }
}

const boardData = {top:boards[Math.floor(Math.random() * 3)], bottom:boards[Math.floor(Math.random() * 3)], left:boards[Math.floor(Math.random() * 3)], right:boards[Math.floor(Math.random() * 3)], front:boards[Math.floor(Math.random() * 3)], back:boards[Math.floor(Math.random() * 3)]};
const CELLS = make_cell_list();
let selectedCell = {
    x: -1,
    y: -1,
    face: "none"
};
showCellData(boardData);
console.log(CELLS)


updateWordHeader();
let angle = 0;
let x = 1;
let y = 1;
let z = 1;
let step = 0.213;

function onFrame() {
    angle += step;
    document.body.style.setProperty("--x", x);
    document.body.style.setProperty("--y", y);
    document.body.style.setProperty("--z", z);
    document.body.style.setProperty("--angle", angle + "deg");
    requestAnimationFrame(onFrame);
}
requestAnimationFrame(onFrame);

function randomAxis() {
    x = Math.random() * 200;
    y = Math.random() * 200;
    z = Math.random() * 200;
}

function randomStep() {
    step = Math.random() * 5;
}

randomAxis();
randomStep();