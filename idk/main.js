import Player from "./Entity/Player.js"
import AlertTextElement from "./UI/AlertTextElement.js";
import Menu from "./UI/Menu.js";
import TextElement from "./UI/TextElement.js";

class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.menu = new Menu();
        this.menu.addUiElement("score", new TextElement("score: 0", 0, 0));
        this.alertNumber = 0;
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.player = new Player({ x: 275, y: 275 }, { width: 50, height: 50 }, "blue");
        this.lastTime = 0;
        this.init();
    }

    init() {
        this.ctx.textBaseline = "top";
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
            this.player.shoot(x, y);
            this.menu.addUiElement("alert" + this.alertNumber, new AlertTextElement("shot!", this.player.pos.x + this.player.size.width / 2, this.player.pos.y + this.player.size.height / 2))
            this.alertNumber++;
            this.alertNumber %= 10;
        }
        document.addEventListener("keydown", keyDown.bind(this));
    
        document.addEventListener("keyup", keyUp.bind(this));

        this.canvas.addEventListener("click", click.bind(this));
    
    }

    update(dt) {
        this.player.update(dt);
        if(this.player.getProjectiles().projectiles.length > 0) {
            for(let i = 0; i < this.player.getProjectiles().projectiles.length; i++) 
                this.player.getProjectiles().projectiles[i].update(dt);
        }

        this.menu.update(dt);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "RED";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        if(this.player.getProjectiles().projectiles.length > 0) {
            for(let i = 0; i < this.player.getProjectiles().projectiles.length; i++) 
                this.player.getProjectiles().projectiles[i].render(this.ctx);
        }

        this.menu.render(this.ctx);
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