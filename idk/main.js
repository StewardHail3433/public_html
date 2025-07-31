import Player from "./Player.js"

class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.player = new Player({ x: 0, y: 0 }, { width: 100, height: 100 }, "blue");
        this.lastTime = 0;
        this.init();
    }

    init() {
        this.initkeyBinds();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initkeyBinds() {

        let keyDown =  (e) => {
            switch (e.key) {
                case 'w':
                    this.player.moving.up = true;
                    break;
                case 'a':
                    this.player.moving.left = true;
                    break;
                case 's':
                    this.player.moving.down = true;
                    break;
                case 'd':
                    this.player.moving.right = true;
                    break;
            }
        }

        let keyUp = (e) => {
            switch (e.key) {
                case 'w':
                    this.player.moving.up = false;
                    break;
                case 'a':
                    this.player.moving.left = false;
                    break;
                case 's':
                    this.player.moving.down = false;
                    break;
                case 'd':
                    this.player.moving.right = false;
                    break;
            }
        }
        document.addEventListener("keydown", keyDown.bind(this));
    
        document.addEventListener("keyup", keyUp.bind(this));
    
    }

    update(dt) {
        this.player.update(dt);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "RED";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
    }

    gameLoop(currentTime) {
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}


new Game();