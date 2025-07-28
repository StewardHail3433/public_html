const CLICKER_CONTAINER = document.getElementById("clicker-container");
const BATTLE_CONTAINER = document.getElementById("battle-container");


let widgetContainer = document.getElementById("widget-container");
let stores = document.getElementsByClassName("store");
let scoreElement = document.getElementById("score");
let fighterSelector = document.getElementById("fighter-selector");
let fighters = [];
let fighterDivs = [];
let targetDivs = [];
let playerTurn = true;
let selectedPlayer;
let selectedComp;
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

function showDamage(widget, damage) {
    let damageElement = document.createElement("span");
    damageElement.className = "damage";
    damageElement.style.fontSize = "18px";
    damageElement.innerHTML = "-" + damage;
    damageElement.onanimationend = () => {
        damageElement.remove();
    }
    widget.appendChild(damageElement);
}

function showHealth(widget) {
    if(widget.getElementsByClassName("health").length > 0)
        widget.getElementsByClassName("health")[0].remove()
    let healthElement = document.createElement("span");
    healthElement.className = "health";
    healthElement.style.fontSize = "18px";
    healthElement.innerHTML = widget.getAttribute("health");
    widget.appendChild(healthElement);
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

function createFighters() {
    if (fighters.length > 0) {
        for (let i = 0; i < fighters.length; i++) {
            for (let store of stores) {
                if (store.getAttribute("name") == fighters[i]) {
                    document.getElementById("platform").appendChild(store.firstElementChild.cloneNode(true))
                    let element = document.getElementById("platform").lastElementChild;
                    element.classList.add("fighter");
                    element.style.top = (40 + 10 * i) + "%";
                    element.style.left = (15 + (i % 2 == 1 ? 15 : 0)) + "%";
                    element.onclick = () => {
                        playerAttacker(element)
                    };
                    fighterDivs.push(element);
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            document.getElementById("platform").appendChild(stores.item(Math.floor(Math.random() * 4)).firstElementChild.cloneNode(true))
            let element = document.getElementById("platform").lastElementChild;
            element.classList.add("fighter");
            element.style.top = (40 + 10 * i) + "%";
            element.style.left = (70 + (i % 2 == 1 ? 15 : 0)) + "%";
            element.onclick = () => {
                playerTarget(element)
            };
            targetDivs.push(element);
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
    showBattle();
    createFighters();
}

function playerAttacker(fighter) {
    if (selectedPlayer == fighter) {
        fighter.classList.remove("selected-fighter");
        selectedPlayer = null;
        return;
    }
    if (selectedPlayer != fighter && selectedPlayer) {
        selectedPlayer.classList.remove("selected-fighter");
        fighter.classList.add("selected-fighter");
        selectedPlayer = fighter;
        return;
    }
    selectedPlayer = fighter;
    fighter.classList.add("selected-fighter");

    if (selectedPlayer && selectedComp) {
        moveForDamage();
    }
}


function moveForDamage() {
    fighterDivs.forEach(element => {
        element.onclick = () => {

        };
    });
    targetDivs.forEach(element => {
        element.onclick = () => {

        };
    });

    let target;
    let attacker;
    let ogTop;
    let ogLeft;
    let slope;
    let intercept;

    if(playerTurn) {
        target = selectedComp
        attacker = selectedPlayer
    } else {
        target = selectedPlayer
        attacker = selectedComp
    
    }

    ogTop = attacker.style.top;
    ogLeft = attacker.style.left;


    const targetRect = target.getBoundingClientRect();
    const containerRect = document.getElementById('platform').getBoundingClientRect();

    let targetTop = ((targetRect.top - containerRect.top) / containerRect.height) * 100;
    let targetLeft = ((targetRect.left - containerRect.left) / containerRect.width) * 100;

    const duration = 1000; // milliseconds
    let startTime = null;

    
    onattack = (currentTime) => {
        // selectedPlayer.style.top = (parseInt(selectedPlayer.style.top) + 1) + "%";
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(elapsedTime / duration, 1); // Clamp progress between 0 and 1

        const currentTop = parseInt(ogTop) + (targetTop - parseInt(ogTop)) * progress;
        const currentLeft = parseInt(ogLeft) + (targetLeft - parseInt(ogLeft)) * progress;

        slope = (parseInt(target.style.top) - parseInt(attacker.style.top)) / ((parseInt(target.style.left)) - parseInt(attacker.style.left));
        intercept = parseInt(attacker.style.top) - (slope * parseInt(attacker.style.left));


        attacker.style.left = currentLeft + "%";
        attacker.style.top = currentTop + "%";

        if (progress >= 1) {
            attacker.style.top = ogTop;
            attacker.style.left = ogLeft;
            console.log(target)
            dealDamage(attacker, target);
            setTimeout(() => {
                afterDamageChecks();
            }, 1000);
        } else {
            requestAnimationFrame(onattack);
        }
    }

    requestAnimationFrame(onattack);
}

function dealDamage(attacker, target) {
    
    target.setAttribute("health", parseInt(target.getAttribute("health")) - parseInt(attacker.getAttribute("damage")));
    showDamage(target, attacker.getAttribute("damage"));
    showHealth(target);
}

function afterDamageChecks(target) {

    if (playerTurn) 
        target = selectedComp
    else
        target = selectedPlayer


    if (parseInt(target.getAttribute("health")) <= 0) {
        target.remove();
    }
    selectedComp.classList.remove("selected-fighter");
    selectedPlayer.classList.remove("selected-fighter");
    selectedComp = null;
    selectedPlayer = null;
    playerTurn = !playerTurn;
    if (!playerTurn) {
        setTimeout(() => {
            selectedComp = targetDivs[Math.floor(Math.random() * targetDivs.length)];
            selectedComp.classList.add("selected-fighter");
        }, 1000);

        setTimeout(() => {
            selectedPlayer = fighterDivs[Math.floor(Math.random() * fighterDivs.length)];
            selectedPlayer.classList.add("selected-fighter");
        }, 3000);

        setTimeout(() => {
            moveForDamage();
        }, 5000);
    } else {
        fighterDivs.forEach(element => {
            element.onclick = () => {
                playerAttacker(element)
            };
        });
        targetDivs.forEach(element => {
            element.onclick = () => {
                playerTarget(element)
            };
        });
    }
}
function playerTarget(target) {
    if (selectedComp == target) {
        target.classList.remove("selected-fighter");
        selectedComp = null;
        return;
    }
    if (selectedComp != target && selectedComp) {
        selectedComp.classList.remove("selected-fighter");
        target.classList.add("selected-fighter");
        selectedComp = target;
        return;
    }
    selectedComp = target;
    target.classList.add("selected-fighter");

    if (selectedPlayer && selectedComp) {
        moveForDamage();
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


