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