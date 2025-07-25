const CLICKER_CONTAINER = document.getElementById("clicker-container");
const BATTLE_CONTAINER = document.getElementById("battle-container");


let widgetContainer = document.getElementById("widget-container");
let stores = document.getElementsByClassName("store");
let scoreElement = document.getElementById("score");
let figterSelector = document.getElementById("fighter-selector");
let fighters = [];
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
}

function hideBattle() {
    document.body.style.backgroundColor = "rgb(0, 31, 0)";
    document.body.style.overflow = "default";
    BATTLE_CONTAINER.style.display = "none";
}

function getAttackers() {
    if (widgetContainer.children.length > 0) {
        figterSelector.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // disable background scroll
        let newWidgetContainer = widgetContainer.cloneNode(true);
        newWidgetContainer.id = "selector-widget-container"
        console.log(newWidgetContainer);
        for (let widget of newWidgetContainer.children) {
            widget.setAttribute("atuo", "false");
            widget.removeAttribute("harvesting");
            console.log(widget);
            widget.children.forEach(child => {
                console.log(child.tagName);
            })
            widget.onclick = () => {
                if (widget.classList.contains("selected-fighter")) {
                    widget.classList.remove("selected-fighter");
                    fighters.forEach((fighter, index) => {
                        if (fighter == widget.getAttribute("name")) {
                            fighters.splice(index, 1);
                        }
                    });
                } else {
                    if (fighters.length < 3) {
                        fighters.push(widget.getAttribute("name"));
                        widget.classList.add("selected-fighter");
                    }
                }
                console.log(fighters);
            }
        }
        newWidgetContainer.style.overflow = "scroll";
        figterSelector.querySelector(".box")?.appendChild(newWidgetContainer);
    }
}


function startBattle() {
    hideClicker();
    figterSelector.style.display = 'none';
    showBattle()
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