import Player from "./Player.js"
import Projectile from "./Projectile.js"

class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.player = new Player({ x: 275, y: 275 }, { width: 50, height: 50 }, "blue");
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

        let click = (e)  => {
            const rect = this.canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            this.projectile = new Projectile({...this.player.pos}, 0, {width:20, width:20}, {x:0, y:0})
            

        }
        document.addEventListener("keydown", keyDown.bind(this));
    
        document.addEventListener("keyup", keyUp.bind(this));

        this.canvas.addEventListener("click", click.bind(this));
    
    }

    update(dt) {
        this.player.update(dt);
        if(this.projectile) {
            this.projectile.update(dt);
            // console.log(this.projectile.pos);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "RED";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        if(this.projectile) {
            this.projectile.render(this.ctx);
        }
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