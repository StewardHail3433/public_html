import Entity  from "./Entity.js";
import Projectile from "../Projectile/Projectile.js";

export default class Player extends Entity {
    constructor(pos = {x: 0, y: 0}, size = {width: 10, height: 10}, color = "red") {
        super(pos, size, color);
        this.speed = 0.3;
        this.moving = {up: false, down: false, left: false, right: false}
        this.projectiles = [];
        this.damage = 10;
    }

    shoot(x, y) {
        this.projectiles.push(new Projectile({x: this.pos.x + this.size.width / 2, y: this.pos.y + this.size.height / 2}, {width:40, height:10}, {x:x, y:y}))
    }

    getProjectiles() {
        return {owner: this, projectiles: this.projectiles};
    }


    update(dt) {
        super.update(dt);

        this.checkProjectileDeletion();
    }

    move(dt) {
        this.vel.y = 0;
        this.vel.x = 0;

        if (this.moving.up) {
            this.vel.y += -this.speed;
        }
        if (this.moving.down) {
            this.vel.y += this.speed;
        }
        if (this.moving.left) {
            this.vel.x += -this.speed;
        }
        if (this.moving.right) {
            this.vel.x += this.speed;
        }

        this.vel.y = Math.min(Math.max(this.vel.y, -this.speed), this.speed);
        this.vel.x = Math.min(Math.max(this.vel.x, -this.speed), this.speed);
        
        
        super.normailizeVel();

        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }

    render(ctx) {
       super.render(ctx)
    }

    checkProjectileDeletion() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectileCenter = {
                x: this.projectiles[i].pos.x + this.projectiles[i].size.width / 2,
                y: this.projectiles[i].pos.y + this.projectiles[i].size.height / 2
            }
            const playerCenter = {
                x: this.pos.x + this.size.width / 2,
                y: this.pos.y + this.size.height / 2
            }
            const distance = Math.sqrt(Math.pow(projectileCenter.x - playerCenter.x, 2), Math.pow(projectileCenter.y - playerCenter.y, 2));
            if(distance > this.projectiles[i].maxDistance) {
                this.projectiles.splice(i, 1);
            }
        }
    }
}