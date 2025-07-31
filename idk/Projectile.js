export default class Projectile {
    constructor(pos = { x: 0, y: 0 }, rotation = 0, size = { width: 10, height: 10 }, target = { x: number, y: number }) {
        this.pos = pos;
        this.initPos = pos;
        this.size = size;
        this.target = target;
        this.vel = { x: 0, y: 0 };
    }

    update(dt) {
        this.move(dt)
    }

    move(dt) {
        if (this.target.x != null ) {
            this.vel.y = this.target.y - this.initPos.y / 5;
            this.vel.x = this.target.x - this.initPos.x / 5;

            // this.normailizeVel();

            // this.vel.y = Math.min(Math.max(this.vel.y, -this.speed), this.speed);
            // this.vel.x = Math.min(Math.max(this.vel.x, -this.speed), this.speed);

            this.pos.x += this.vel.x * dt;
            this.pos.y += this.vel.y * dt;
            console.log(this.pos);
        }
    }


    onEntityHit(entity) {

    }

    onProjectileHit(projectile) {

    }

    normailizeVel() {
        let distance = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        if (distance > 0) {
            this.vel.x = (this.vel.x / distance) * this.speed;
            this.vel.y = (this.vel.y / distance) * this.speed;
        }
    }

    render(ctx) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        ctx.closePath();
        ctx.fill();
    }
}