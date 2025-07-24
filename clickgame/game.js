let widgetContainer = document.getElementById("widget-container");
let stores = document.getElementsByClassName("store");
let scoreElement = document.getElementById("score");

let score = 155;
let superGompeiCount = 0 ;

function changeScore(amount) {
    score += amount;
    scoreElement.innerHTML = "Score: " + score;

    for(let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if(cost >= score) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}

function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));
    
    if(cost > score) {
        return;
    }

    changeScore(-cost);
    let newWidget = store.firstElementChild.cloneNode(true)

    const superGompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if(store.getAttribute("name") === "Super-Gompei" && superGompei) {
        superGompeiCount++;
        document.body.style.setProperty("--gompei-count", superGompeiCount);
        let oldReap = parseInt(superGompei.getAttribute("reap"));
        superGompei.setAttribute("reap", (oldReap + 100));
        return;
    }

    newWidget.onclick = () => {
        harvest(newWidget);
    }
    

    widgetContainer.appendChild(newWidget);

    if(newWidget.getAttribute("auto") == "true") {
        newWidget.setAttribute("harvesting", "");
        setupEndHarvest(newWidget);
    }
}

function setupEndHarvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting");
        if(widget.getAttribute("auto") == "true") {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    if(widget.hasAttribute("harvesting"))
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


changeScore(0);