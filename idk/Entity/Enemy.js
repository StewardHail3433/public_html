import Entity from "./Entity.js";

export default class Enemy extends Entity {

    constructor(pos = { x: 0, y: 0 }, size = { width: 10, height: 10 }, color = "red", target = null) {
        super(pos, size, color);
        this.target = target;
        this.speed = 0.1;
        this.id = null;
        this.damage = 10;
    }

    update(dt) {
        this.vel.y = 0;
        this.vel.x = 0;
        this.followTarget();
        super.update(dt);
    }

    followTarget() {
        if(this.target) {
            const dx = this.target.pos.x - this.pos.x;
            const dy = this.target.pos.y - this.pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance != 0) {
                this.vel.x = dx / distance * this.speed;
                this.vel.y = dy / distance * this.speed;
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }
        }
    }

}