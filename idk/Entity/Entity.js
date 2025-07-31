export default class Entity {
    constructor(pos = {x: 0, y: 0}, size = {width: 10, height: 10}, color = "red") {
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.vel = {x: 0, y: 0};
        this.speed = 1;
    }

    update(dt) {
        this.move(dt);
    }

    move(dt) {
        this.vel.y = 0;
        this.vel.x = 0;

        this.normailizeVel();

        this.vel.y = Math.min(Math.max(this.vel.y, -this.speed), this.speed);
        this.vel.x = Math.min(Math.max(this.vel.x, -this.speed), this.speed);
        
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

    normailizeVel() {
        let distance = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        if (distance > 0) {
            this.vel.x = (this.vel.x / distance) * this.speed;
            this.vel.y = (this.vel.y / distance) * this.speed;
        }
    }
}