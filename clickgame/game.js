const CLICKER_CONTAINER = document.getElementById("clicker-container");
const BATTLE_CONTAINER = document.getElementById("battle-container");


let widgetContainer = document.getElementById("widget-container");
let stores = document.getElementsByClassName("store");
let scoreElement = document.getElementById("score");
let fighterSelector = document.getElementById("fighter-selector");
let fighters = [];
let selectedAttacker;
let selectedTarget;
let score = 155;
let superGompeiCount = 0;

function changeScore(amount) {
    score += amount;
    scoreElement.innerHTML = "Score: " + score;

    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (cost >= score) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}

function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));

    if (cost > score) {
        return;
    }

    changeScore(-cost);
    let newWidget = store.firstElementChild.cloneNode(true)

    const superGompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if (store.getAttribute("name") === "Super-Gompei" && superGompei) {
        superGompeiCount++;
        store.setAttribute("cost", cost + 50);
        store.children.item(2).innerHTML = (cost + 50) + " points";
        document.body.style.setProperty("--gompei-count", superGompeiCount);
        let oldReap = parseInt(superGompei.getAttribute("reap"));
        superGompei.setAttribute("reap", (oldReap + 100));
        store.children.item(3).innerHTML = "$" + (oldReap + 100) + " sqft";
        return;
    }

    newWidget.onclick = () => {
        harvest(newWidget);
    }


    widgetContainer.appendChild(newWidget);

    if (newWidget.getAttribute("auto") == "true") {
        newWidget.setAttribute("harvesting", "");
        setupEndHarvest(newWidget);
    }
}

function setupEndHarvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting");
        if (widget.getAttribute("auto") == "true") {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    if (widget.hasAttribute("harvesting"))
        return;
    widget.setAttribute("harvesting", "");

    changeScore(parseInt(widget.getAttribute("reap")));
    givePoints(widget);

    setupEndHarvest(widget);
}

function givePoints(widget) {
    let pointsElement = document.createElement("span");
    pointsElement.className = "point";
    pointsElement.innerHTML = "+" + widget.getAttribute("reap");
    pointsElement.onanimationend = () => {
        pointsElement.remove();
    }
    widget.appendChild(pointsElement);

}

function hideClicker() {
    document.body.style.backgroundColor = "rgb(255, 255, 255)";
    CLICKER_CONTAINER.style.display = "none";
}

function showClicker() {
    document.body.style.backgroundColor = "rgb(0, 31, 0)";
    document.body.style.overflow = "default";
    CLICKER_CONTAINER.style.display = "block";
}

function showBattle() {
    document.body.style.backgroundColor = "rgb(0, 0, 0)";
    document.body.style.overflow = "hidden";
    BATTLE_CONTAINER.style.display = "block";

    if (fighters.length > 0) {
        for (let i = 0; i < fighters.length; i++) {
            for (let store of stores) {
                if (store.getAttribute("name") == fighters[i]) {
                    document.getElementById("platform").appendChild(store.firstElementChild.cloneNode(true))
                    let element = document.getElementById("platform").lastElementChild;
                    element.classList.add("fighter");
                    element.style.top = (30 + 10 * i) + "%";
                    element.style.left = (15 + (i % 2 == 1 ? 15 : 0)) + "%";
                    element.onclick = () => {
                        playerAttacker(element)
                    };
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            document.getElementById("platform").appendChild(stores.item(Math.floor(Math.random() * 4)).firstElementChild.cloneNode(true))
            let element = document.getElementById("platform").lastElementChild;
            element.classList.add("fighter");
            element.style.top = (30 + 10 * i) + "%";
            element.style.right = (15 + (i % 2 == 1 ? 15 : 0)) + "%";
            element.onclick = () => {
                playerTarget(element)
            };
        }

    } else {
        hideBattle();
        showClicker();
    }
}

function hideBattle() {
    fighters = [];

    if (document.getElementById("platform").children.length > 1) {
        for (let c of Array.from(document.getElementById("platform").children).reverse()) {

            if (document.getElementById("platform").children.length == 1)
                break;

            c.remove();
        }
    }
    document.body.style.backgroundColor = "rgb(0, 31, 0)";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    BATTLE_CONTAINER.style.display = "none";
}

function getAttackers() {
    fighterSelector.querySelector(".box")?.lastChild.remove();
    fighters = [];
    if (widgetContainer.children.length > 0) {
        fighterSelector.style.display = 'flex';
        document.body.style.overflowY = 'hidden'; // disable background scroll
        let newWidgetContainer = widgetContainer.cloneNode(true);
        newWidgetContainer.id = "selector-widget-container"

        for (let widget of Array.from(newWidgetContainer.children)) {
            widget.setAttribute("auto", "false");
            widget.removeAttribute("harvesting");
            widget.onclick = () => {
                if (widget.classList.contains("selected-fighter")) {
                    widget.classList.remove("selected-fighter");
                    for (let i = 0; i < fighters.length; i++) {
                        if (fighters[i] == widget.getAttribute("name")) {
                            fighters.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    if (fighters.length < 3) {
                        fighters.push(widget.getAttribute("name"));
                        widget.classList.add("selected-fighter");
                    }
                }
            }
            widget.style.width = "100px"
            widget.style.height = "100px"
        }
        fighterSelector.querySelector(".box")?.appendChild(newWidgetContainer);
    }
}


function startBattle() {
    hideClicker();
    fighterSelector.style.display = 'none';
    showBattle()
}

function playerAttacker(fighter) {
    if (selectedAttacker == fighter) {
        fighter.classList.remove("selected-fighter");
        selectedAttacker = null;
        return;
    }
    if (selectedAttacker != fighter && selectedAttacker) {
        selectedAttacker.classList.remove("selected-fighter");
        fighter.classList.add("selected-fighter");
        selectedAttacker = fighter;
        return;
    }
    selectedAttacker = fighter;
    fighter.classList.add("selected-fighter");

    if (selectedAttacker && selectedTarget) {
        dealDamage();
    }
}

function playerTarget(target) {
    if (selectedTarget == target) {
        target.classList.remove("selected-fighter");
        selectedTarget = null;
        return;
    }
    if (selectedTarget != target && selectedTarget) {
        selectedTarget.classList.remove("selected-fighter");
        target.classList.add("selected-fighter");
        selectedTarget = target;
        return;
    }
    selectedTarget = target;
    target.classList.add("selected-fighter");

    if (selectedAttacker && selectedTarget) {
        dealDamage();
    }
}

hideBattle();
// showClicker();
// hideClicker();
// showBattle()
changeScore(0);


document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        getAttackers();
    }
    if (e.key == "Enter") {
        hideClicker();
        showBattle();
    }
    if (e.key == "1") {
        showClicker();
        hideBattle();
    }
})