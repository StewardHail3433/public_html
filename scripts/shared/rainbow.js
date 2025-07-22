let angle = 0;

function onFrame() {
    angle = (angle + 1) % 360;
    document.body.style.backgroundColor = `hsl(${angle}deg, 100%, 50%)`;
    document.body.style.setProperty("--rotation", (angle + 180) + "deg")
    requestAnimationFrame(onFrame);
}

requestAnimationFrame(onFrame)