import Entity  from "./Entity.js";

export default class Player extends Entity {
    constructor(pos = {x: 0, y: 0}, size = {width: 10, height: 10}, color = "red") {
        super(pos, size, color);
        this.speed = 0.3;
        this.moving = {up: false, down: false, left: false, right: false}
    }

    update(dt) {
        super.update(dt);
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.closePath();
        ctx.fill();
    }
}