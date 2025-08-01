import Player from "./Entity/Player.js"
import AlertTextElement from "./UI/AlertTextElement.js";
import Menu from "./UI/Menu.js";
import TextElement from "./UI/TextElement.js";
import Enemy from "./Entity/Enemy.js";
import HealthBarElement from "./UI/HealthBarElement.js";
import CollisionHandler from "./Collisions/CollisionHandler.js";
import Utils from "./utils/Utils.js";

const startBtn = document.getElementById("start-btn");

class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.gameUI = new Menu();
        this.gameUI.addUiElement("score", new TextElement("score: 0", 0, 0));
        this.gameUI.addUiElement("enemyLeft", new TextElement("Enemies Left: 0", 0, 25));

        this.gameUI.addUiElement("death", new TextElement("", 300, 0,"Arial","white",20,"center"));
        this.AlertUI = new Menu();
        this.alertNumber = 0;
        this.enemies = []

        this.canvas.width = 600;
        this.canvas.height = 600;
        this.player = new Player({ x: 275, y: 275 }, { width: 50, height: 50 }, "blue");
        this.player.healthBar = new HealthBarElement(this.player.pos.x, this.player.pos.y, this.player.health, this.player.maxHealth);
        this.gameUI.addUiElement("player_health", this.player.healthBar);
        this.lastTime = 0;
        this.enemyIdCount = 0;
        this.score = 0;
        this.init();
    }

    spawnEnemies() {
        for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
            let x = 0;
            let y = 0;
            let distance = 0;
            let onTopOfPlayer = false;

            do {
                x = this.player.pos.x + this.player.size.width / 2 + (Math.random() - 0.5) * 800; // random position
                y = this.player.pos.y + this.player.size.height / 2 + (Math.random() - 0.5) * 800;
                distance = Math.hypot(x - (this.player.pos.x + this.player.size.width / 2), y - (this.player.pos.y + this.player.size.height / 2));

                onTopOfPlayer = Utils.containBox({ ...this.player.pos, ...this.player.size }, { x: x, y: y, width: 50, height: 50 })
            } while (distance < 250 && onTopOfPlayer);
            const enemy = new Enemy({ x: x, y: y }, { width: 50, height: 50 }, "green", this.player);
            enemy.healthBar = new HealthBarElement(enemy.pos.x, enemy.pos.y, enemy.health, enemy.maxHealth);
            enemy.id = this.enemyIdCount;
            this.enemyIdCount++;
            this.gameUI.addUiElement("enemy_health_" + enemy.id, enemy.healthBar)
            this.enemies.push(enemy);
        }
        this.gameUI.getElement("enemyLeft").updateText("Enemies Left: " + this.enemies.length);
    }

    init() {
        this.spawnEnemies();
        this.ctx.textBaseline = "top";
        this.initkeyBinds();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initkeyBinds() {

        let keyDown = (e) => {
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
                case 'l':
                    const enemy = new Enemy({ x: 0, y: 0 }, { width: 50, height: 50 }, "green", this.player);
                    enemy.healthBar = new HealthBarElement(enemy.pos.x, enemy.pos.y, enemy.health, enemy.maxHealth);
                    enemy.id = this.enemyIdCount;
                    this.enemyIdCount++;
                    this.enemies.push(enemy);
                    this.gameUI.addUiElement("enemy_health_" + enemy.id, enemy.healthBar)
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

        let click = (e) => {
            const rect = this.canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            this.player.shoot(x, y);
            this.AlertUI.addUiElement("alert" + this.alertNumber, new AlertTextElement("shot!", this.player.pos.x + this.player.size.width / 2, this.player.pos.y + this.player.size.height / 2))
            this.alertNumber++;
            this.alertNumber %= 10;
        }
        document.addEventListener("keydown", keyDown.bind(this));

        document.addEventListener("keyup", keyUp.bind(this));

        this.canvas.addEventListener("click", click.bind(this));

    }

    update(dt) {
        this.player.update(dt);
        if (this.player.getProjectiles().projectiles.length > 0) {
            for (let i = 0; i < this.player.getProjectiles().projectiles.length; i++)
                this.player.getProjectiles().projectiles[i].update(dt);
            
        }
        if(this.player.shouldDelete) {
                this.gameUI.getElement("death").updateText("You Died");
                document.getElementById("start-btn").style.display = "inline-block"
            }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(dt);
            if (this.enemies[i].shouldDelete) {
                this.score++;
                this.gameUI.getElement("score").updateText("score: " + this.score);
                this.player.health += 10;
                this.player.health = Math.min(this.player.health, this.player.maxHealth);
                this.gameUI.deleteElement("enemy_health_" + this.enemies[i].id)
                this.enemies.splice(i, 1);
                this.gameUI.getElement("enemyLeft").updateText("Enemies Left: " + this.enemies.length);
                if(this.enemies.length == 0) {
                    setTimeout(() => {
                        this.spawnEnemies();
                    }, 3000);
                }
                continue;
            }
            let damage = CollisionHandler.checkProjectileCollision(this.enemies[i], this.player.getProjectiles().projectiles);
            if (damage) {
                this.AlertUI.addUiElement("enemy_hit_" + this.enemies[i].id, new AlertTextElement(damage, this.enemies[i].pos.x + this.enemies[i].size.width / 2, this.enemies[i].pos.y + this.enemies[i].size.height / 2, 0.075, "Arial", "red"))
            }
            CollisionHandler.checkPlayerEnemyCollision(this.player, this.enemies[i]);
        }



        this.AlertUI.update(dt);
        this.gameUI.update(dt);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this.ctx);
        }

        if (this.player.getProjectiles().projectiles.length > 0) {
            for (let i = 0; i < this.player.getProjectiles().projectiles.length; i++)
                this.player.getProjectiles().projectiles[i].render(this.ctx);
        }

        this.AlertUI.render(this.ctx);
        this.gameUI.render(this.ctx);
    }

    gameLoop(currentTime) {
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();
        if(!this.player.shouldDelete)
            requestAnimationFrame(this.gameLoop.bind(this));
    }
}


startBtn.addEventListener("click", () => {
    startBtn.style.display ="none";
new Game();
})
