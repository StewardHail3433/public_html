const CLICKER_CONTAINER = document.getElementById("clicker-container");
const STORE_CONTAINER = document.getElementById("store-container");
const BATTLE_CONTAINER = document.getElementById("battle-container");


let widgetContainer = document.getElementById("widget-container");
let stores = document.getElementsByClassName("store");
let scoreElement = document.getElementById("score");
let fighterSelector = document.getElementById("fighter-selector");
// let fighters = [];
// let fighterDivs = [];
// let targetDivs = [];
// let playerTurn = true;
// let selectedPlayer;
// let selectedComp;
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
    if (widget.getElementsByClassName("health").length > 0)
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
    document.body.style.overflowY = 'scroll';
    document.body.style.display = "block"
    CLICKER_CONTAINER.style.display = "block";
    fighterSelector.style.display = 'none';
    document.getElementById("selection").style.display = "none";
    document.getElementById("battle-info").style.display = "none";
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
            document.getElementById("platform").appendChild(stores.item(Math.floor(Math.random() * stores.length)).firstElementChild.cloneNode(true))
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
    if (widgetContainer.children.length > 0) {
        fighterSelector.style.display = 'flex';
        document.getElementById("selection").style.display = "block";
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
        document.getElementById("selection").appendChild(newWidgetContainer);
    }
}

function startBattle() {
    hideClicker();
    battle.startBattle();

    let checkWinner = () => {
        let winner = battle.getWinner();
        console.log(winner);
        if (winner != "" && winner) {
            winnerActions(winner);
            
            return;
        } else {
            requestAnimationFrame(checkWinner);
        }
    }

    requestAnimationFrame(checkWinner);

    // document.getElementById("selection").style.display = "none";
    // fighterSelector.style.display = 'none';
    // showBattle();
    // createFighters();
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

function moveForDamage() {
    fighterDivs.forEach(element => {
        element.onclick = () => {

        };
    });
    targetDivs.forEach(element => {
        element.onclick = () => {

        };
    });

    let target, attacker, ogTop, ogLeft;

    if (playerTurn) {
        target = selectedComp;
        attacker = selectedPlayer;
    } else {
        target = selectedPlayer;
        attacker = selectedComp;

    }

    ogTop = attacker.style.top;
    ogLeft = attacker.style.left;


    const targetRect = target.getBoundingClientRect();
    const containerRect = document.getElementById('platform').getBoundingClientRect();

    let targetTop = ((targetRect.top - containerRect.top) / containerRect.height) * 100;
    let targetLeft = ((targetRect.left - containerRect.left) / containerRect.width) * 100;

    const duration = 500;
    let startTime = null;


    onattack = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(elapsedTime / duration, 1);

        const currentTop = parseInt(ogTop) + (targetTop - parseInt(ogTop)) * progress;
        const currentLeft = parseInt(ogLeft) + (targetLeft - parseInt(ogLeft)) * progress;

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
    checkDeath(target);

    if (checkWin().length > 0) {
        let winner = checkWin()
        resetBattle();
        hideBattle();
        showClicker();
        winnerActions(winner)
        return;
    }

    selectedComp.classList.remove("selected-fighter");
    selectedPlayer.classList.remove("selected-fighter");
    selectedComp = null;
    selectedPlayer = null;

    nextTurn();
}

function winnerActions(winner) {
    showClicker();
    fighterSelector.style.display = 'flex';
    document.body.style.overflowY = 'hidden';
    document.getElementById("selection").style.display = "none";
    document.getElementById("battle-info").style.display = "block";
    if(winner == "player") {
        document.getElementById("info").innerHTML = `You won, you gain 2000 score`
        changeScore(200)
    } else {
        let lostWidgets = Math.floor(Math.random() * widgetContainer.children.length);
        for(let i = 0; i < lostWidgets; i++) {
            widgetContainer.children.item(Math.floor(Math.random() * widgetContainer.children.length)).remove();
        }
        document.getElementById("info").innerHTML = `You lost, you lost ${lostWidgets} widgets 🥺 and 4000 score (dont worry you still have a score of 5 if you dont have 4000)`
        changeScore(-4000);
        if(score < 5) {
            score = 5;
        }
    }
}

function checkDeath(target) {
    if (parseInt(target.getAttribute("health")) <= 0) {
        target.remove();
        for (let i = 0; i < fighterDivs.length; i++) {
            if (fighterDivs[i] == target) {
                fighterDivs.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < targetDivs.length; i++) {
            if (targetDivs[i] == target) {
                targetDivs.splice(i, 1);
                break;
            }
        }
    }
}

function checkWin() {
    if (fighterDivs.length == 0) {
        return "comp";
    }
    if (targetDivs.length == 0) {
        return "player";
    }
    return "";
}

function resetBattle() {
    selectedComp = null;
    selectedPlayer = null;
    fighters = [];
    fighterDivs = [];
    targetDivs = [];
    playerTurn = true;
}

function nextTurn() {
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

function createStore(name, cost, reap, auto, cooldown, health, damage, text, imgPath) {
    let store = document.createElement("div");
    store.classList.add("store");
    store.setAttribute("name", name);
    store.setAttribute("cost", cost);
    store.setAttribute("reap", reap);
    store.setAttribute("cooldown", cooldown);
    store.setAttribute("auto", auto);
    store.onclick = (event) => {
        buy(event.currentTarget);
    };

    let widget = document.createElement("div");
    widget.classList.add("widget");
    widget.setAttribute("name", name);
    widget.setAttribute("reap", reap);
    widget.setAttribute("cooldown", cooldown);
    widget.setAttribute("auto", auto);
    widget.setAttribute("health", health);
    widget.setAttribute("damage", damage);

    if (text.length > 0) {
        let nameElement = document.createElement("p");
        nameElement.innerHTML = text
        widget.appendChild(nameElement);
    } else {
        let img = document.createElement("img");
        img.src = imgPath;
        widget.appendChild(img);
    }

    let overlay = document.createElement("div");
    overlay.classList.add("overlay-slide");
    overlay.style.animationDuration = `${cooldown}s`;
    widget.appendChild(overlay);

    store.appendChild(widget);

    let pName = document.createElement("p");
    pName.innerHTML = name;

    let pCost = document.createElement("p");
    pCost.innerHTML = `${cost} points`;

    let pReap = document.createElement("p");
    pReap.innerHTML = `+${reap} sqft`;

    let pCooldown = document.createElement("p");
    pCooldown.innerHTML = `${cooldown}s`;

    let pHealth = document.createElement("p");
    pHealth.innerHTML = `Health: ${health}`;

    let pDamage = document.createElement("p");
    pDamage.innerHTML = `Damage: ${damage}`;

    store.appendChild(pName);
    store.appendChild(pCost);
    store.appendChild(pReap);
    store.appendChild(pCooldown);
    store.appendChild(pHealth);
    store.appendChild(pDamage);

    STORE_CONTAINER.appendChild(store);
}

createStore("JS", 100, 75, false, 1.5, 75, 50, "", "./js.png");
createStore("HTML", 50, 30, false, 1, 40, 15, "", "./HTML.png");
createStore("CSS", 75, 50, false, 1.2, 60, 25, "CSS", "./css.png");
createStore("Python", 150, 100, true, 2, 100, 60, "Python", "./python.png");
createStore("C++", 250, 160, true, 3, 150, 90, "C++", "./cpp.png");
createStore("Java", 400, 220, true, 4, 180, 110, "JAVA", "./java.png");
createStore("Rust", 600, 300, true, 4.5, 200, 130, "RUST", "./rust.png");
createStore("Go", 850, 400, true, 5.5, 220, 150, "Go", "./go.png");
createStore("C#", 1200, 500, true, 6, 250, 180, "C#", "./csharp.png");
createStore("Assembly", 2000, 800, false, 7.5, 300, 250, "Assembly", "");


hideBattle();
changeScore(0);

class Battle {
    constructor(widgetContainer) {
        this.widgetContainer = widgetContainer;
        this.getElements();
        this.getFighterNames();
    }
    getElements() {
        this.battleContainer = document.getElementById("battle-container");
        this.fighterSelector = document.getElementById("fighter-selector");

        this.fightersNames = [];
        this.playerDivs = [];
        this.compDivs = [];
        this.playerTurn = true;
        this.selectedPlayer = null;
        this.selectedComp = null;
    }
    createFighters() {
        let stores = document.getElementsByClassName("store");
        if (this.fightersNames.length > 0) {
            for (let i = 0; i < this.fightersNames.length; i++) {
                for (let store of stores) {
                    if (store.getAttribute("name") == this.fightersNames[i]) {
                        document.getElementById("platform").appendChild(store.firstElementChild.cloneNode(true))
                        let element = document.getElementById("platform").lastElementChild;
                        element.classList.add("fighter");
                        element.style.top = (40 + 10 * i) + "%";
                        element.style.left = (15 + (i % 2 == 1 ? 15 : 0)) + "%";
                        element.onclick = () => {
                            this.onPlayerAttackerClick(element)
                        };
                        this.playerDivs.push(element);
                    }
                }
            }

            for (let i = 0; i < 3; i++) {
                document.getElementById("platform").appendChild(stores.item(Math.floor(Math.random() * stores.length)).firstElementChild.cloneNode(true))
                let element = document.getElementById("platform").lastElementChild;
                element.classList.add("fighter");
                element.style.top = (40 + 10 * i) + "%";
                element.style.left = (70 + (i % 2 == 1 ? 15 : 0)) + "%";
                element.onclick = () => {
                    this.onPlayerTarrgetClick(element)
                };
                this.compDivs.push(element);
            }

        } else {
            this.hideBattle();
            return false;
        }
        return true;
    }

    hideBattle() {
        this.fightersNames = [];

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
        this.battleContainer.style.display = "none";
    }
    getFighterNames() {
        document.getElementById("selector-widget-container")?.remove();
        if (this.widgetContainer.children.length > 0) {
            this.fighterSelector.style.display = 'flex';
            document.getElementById("selection").style.display = "block";
            document.body.style.overflowY = 'hidden'; // disable background scroll
            let newWidgetContainer = this.widgetContainer.cloneNode(true);
            newWidgetContainer.id = "selector-widget-container"

            for (let widget of Array.from(newWidgetContainer.children)) {
                widget.setAttribute("auto", "false");
                widget.removeAttribute("harvesting");
                widget.onclick = () => {
                    if (widget.classList.contains("selected-fighter")) {
                        widget.classList.remove("selected-fighter");
                        for (let i = 0; i < this.fightersNames.length; i++) {
                            if (this.fightersNames[i] == widget.getAttribute("name")) {
                                this.fightersNames.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        if (this.fightersNames.length < 3) {
                            this.fightersNames.push(widget.getAttribute("name"));
                            widget.classList.add("selected-fighter");
                        }
                    }
                }
                widget.style.width = "100px"
                widget.style.height = "100px"
            }
            document.getElementById("selection").appendChild(newWidgetContainer);
        }
    }

    showBattle() {
        document.body.style.backgroundColor = "rgb(0, 0, 0)";
        document.body.style.overflow = "hidden";
        this.battleContainer.style.display = "block";
    }

    startBattle() {
        document.getElementById("selection").style.display = "none";
        // this.hideClicker();
        this.fighterSelector.style.display = 'none';
        this.showBattle();
        this.createFighters();
    }

    moveForDamage() {
        this.playerDivs.forEach(element => {
            element.onclick = () => {

            };
        });
        this.compDivs.forEach(element => {
            element.onclick = () => {

            };
        });

        let target, attacker, ogTop, ogLeft;

        if (this.playerTurn) {
            target = this.selectedComp;
            attacker = this.selectedPlayer;
        } else {
            target = this.selectedPlayer;
            attacker = this.selectedComp;

        }

        ogTop = attacker.style.top;
        ogLeft = attacker.style.left;


        const targetRect = target.getBoundingClientRect();
        const containerRect = document.getElementById('platform').getBoundingClientRect();

        let targetTop = ((targetRect.top - containerRect.top) / containerRect.height) * 100;
        let targetLeft = ((targetRect.left - containerRect.left) / containerRect.width) * 100;

        const duration = 500;
        let startTime = null;


        let onmoveFrame = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;

            const progress = Math.min(elapsedTime / duration, 1);

            const currentTop = parseInt(ogTop) + (targetTop - parseInt(ogTop)) * progress;
            const currentLeft = parseInt(ogLeft) + (targetLeft - parseInt(ogLeft)) * progress;

            attacker.style.left = currentLeft + "%";
            attacker.style.top = currentTop + "%";

            if (progress >= 1) {
                attacker.style.top = ogTop;
                attacker.style.left = ogLeft;
                console.log(target)
                this.dealDamage(attacker, target);
                setTimeout(() => {
                    this.afterDamageChecks();
                }, 1000);
            } else {
                requestAnimationFrame(onmoveFrame);
            }
        }

        requestAnimationFrame(onmoveFrame);
    }

    dealDamage(attacker, target) {
        target.setAttribute("health", parseInt(target.getAttribute("health")) - parseInt(attacker.getAttribute("damage")));
        showDamage(target, attacker.getAttribute("damage"));
        showHealth(target);
    }

    showDamage(widget, damage) {
        let damageElement = document.createElement("span");
        damageElement.className = "damage";
        damageElement.style.fontSize = "18px";
        damageElement.innerHTML = "-" + damage;
        damageElement.onanimationend = () => {
            damageElement.remove();
        }
        widget.appendChild(damageElement);
    }

    showHealth(widget) {
        if (widget.getElementsByClassName("health").length > 0)
            widget.getElementsByClassName("health")[0].remove()
        let healthElement = document.createElement("span");
        healthElement.className = "health";
        healthElement.style.fontSize = "18px";
        healthElement.innerHTML = widget.getAttribute("health");
        widget.appendChild(healthElement);
    }

    afterDamageChecks(target) {

        if (this.playerTurn)
            target = this.selectedComp
        else
            target = this.selectedPlayer
        this.checkDeath(target);

        if (this.checkWin().length > 0) {
            this.resetBattle();
            this.hideBattle();
            return;
        }

        this.selectedComp.classList.remove("selected-fighter");
        this.selectedPlayer.classList.remove("selected-fighter");
        this.selectedComp = null;
        this.selectedPlayer = null;

        this.nextTurn();
    }

    nextTurn() {
        this.playerTurn = !this.playerTurn;
        if (!this.playerTurn) {
            setTimeout(() => {
                this.selectedComp = this.compDivs[Math.floor(Math.random() * this.compDivs.length)];
                this.selectedComp.classList.add("selected-fighter");
            }, 1000);

            setTimeout(() => {
                this.selectedPlayer = this.playerDivs[Math.floor(Math.random() * this.playerDivs.length)];
                this.selectedPlayer.classList.add("selected-fighter");
            }, 3000);

            setTimeout(() => {
                this.moveForDamage();
            }, 5000);
        } else {
            this.playerDivs.forEach(element => {
                element.onclick = () => {
                    this.onPlayerAttackerClick(element)
                };
            });
            this.compDivs.forEach(element => {
                element.onclick = () => {
                    this.onPlayerTarrgetClick(element)
                };
            });
        }
    }

    resetBattle() {
        this.selectedComp = null;
        this.selectedPlayer = null;
        this.fighterNames = [];
        this.playerDivs = [];
        this.compDivs = [];
        this.playerTurn = true;
    }

    onPlayerAttackerClick(fighter) {
        if (this.selectedPlayer == fighter) {
            fighter.classList.remove("selected-fighter");
            this.selectedPlayer = null;
            return;
        }
        if (this.selectedPlayer != fighter && this.selectedPlayer) {
            this.selectedPlayer.classList.remove("selected-fighter");
            fighter.classList.add("selected-fighter");
            this.selectedPlayer = fighter;
            return;
        }
        this.selectedPlayer = fighter;
        fighter.classList.add("selected-fighter");

        if (this.selectedPlayer && this.selectedComp) {
            this.moveForDamage();
        }
    }

    onPlayerTarrgetClick(target) {
        if (this.selectedComp == target) {
            target.classList.remove("selected-fighter");
            this.selectedComp = null;
            return;
        }
        if (this.selectedComp != target && this.selectedComp) {
            this.selectedComp.classList.remove("selected-fighter");
            target.classList.add("selected-fighter");
            this.selectedComp = target;
            return;
        }
        this.selectedComp = target;
        target.classList.add("selected-fighter");

        if (this.selectedPlayer && this.selectedComp) {
            this.moveForDamage();
        }
    }

    checkDeath(target) {
        if (parseInt(target.getAttribute("health")) <= 0) {
            target.remove();
            for (let i = 0; i < this.playerDivs.length; i++) {
                if (this.playerDivs[i] == target) {
                    this.playerDivs.splice(i, 1);
                    break;
                }
            }

            for (let i = 0; i < this.compDivs.length; i++) {
                if (this.compDivs[i] == target) {
                    this.compDivs.splice(i, 1);
                    break;
                }
            }
        }
    }

    checkWin() {
        if (this.playerDivs.length == 0) {
            this.winner = "comp";
        }
        if (this.compDivs.length == 0) {
            this.winner = "player";
        }
        return this.winner || "";
    }

    getWinner() {
        return this.winner;
    }
}
let battle
document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        battle = new Battle(widgetContainer);// getAttackers();
    }
})
