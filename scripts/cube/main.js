let mainDiv = document.getElementById("cube")

let cubeData = {
    size: 100,
    rotaion: [90,90,90],
    translation: [0,0,0]
}

function init() {
    for(let i = 0; i < 6; i++) {
        let face = document.createElement("img");
        face.src = "assets/graphic.jpg";
        face.width = cubeData.size + "px";
        face.height = cubeData.size + "px";
        face.style.width = cubeData.size + "px";
        face.style.height = cubeData.size + "px";

        if(i < 2) {
            if(i % 2 == 0) {
                face.style.transform = "translate3d(0, 0, " + cubeData.size + "px) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)";
            } else {
                face.style.transform = "translate3d(0, 0, " + -cubeData.size + "px) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)"
            }
        } else if(i < 4) {
            if(i % 2 == 0) {
                face.style.transform = "translate3d(" + cubeData.size + "px, 0, 0) rotate3d(0, 1, 0, 90deg) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)";
            } else {
                face.style.transform = "translate3d(" + (-cubeData.size) + "px, 0, 0) rotate3d(0, 1, 0, 90deg) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)";
            }
        } else{
            if(i % 2 == 0) {
                face.style.transform = "translate3d(0, " + cubeData.size + "px, 0) rotate3d(1, 0, 0, 90deg) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)";
            } else {
                face.style.transform = "translate3d(0, " + -cubeData.size + "px, 0) rotate3d(1, 0, 0, 90deg) rotate3d(1, 0, 0, " + (cubeData.rotaion[0]) + "deg) rotate3d(0, 1, 0, " + (cubeData.rotaion[1]) + "deg) rotate3d(0, 0, 1, " + (cubeData.rotaion[2]) + "deg)";
            }
        }

        // face.style.position = "relative";
        face.style.marginRight =  -cubeData.size + "px";
        

        mainDiv.appendChild(face);
    }
}

function renderCube() {

}


init();