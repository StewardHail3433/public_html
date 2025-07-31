export default class Projectile {
    constructor(pos = { x: 0, y: 0 }, size = { width: 10, height: 10 }, target = { x: number, y: number }) {
        this.pos = pos;
        this.initPos = pos;
        this.size = size;
        this.target = target //target.x != null ? {x: target.x - this.size.x / 2, y: target.y - this.size.y / 2} : {x: 0, y: 0};
        this.target.x -= this.size.width / 2;
        this.target.y -= this.size.height / 2;
        this.vel = { x: 0, y: 0 };
        this.speed = 0.3;
        this.maxDistance = 300;
        

        const deltaX = this.target.x - this.initPos.x;
        const deltaY = this.target.y - this.initPos.y;
        this.rotation = (Math.atan2(deltaY - this.size.height / 2, deltaX - this.size.width / 2) * (180 / Math.PI));

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance != 0) {
            this.vel = {
                x: (deltaX / distance) * this.speed,
                y: (deltaY / distance) * this.speed
            };
        } else {
            this.vel = { x: 0, y: 0 };
        }

    }

    update(dt) {
        this.move(dt)
    }

    move(dt) {
        if (this.target.x != null ) {

            // this.normailizeVel();

            // this.vel.y = Math.min(Math.max(this.vel.y, -this.speed), this.speed);
            // this.vel.x = Math.min(Math.max(this.vel.x, -this.speed), this.speed);

            this.pos.x += this.vel.x * dt;
            this.pos.y += this.vel.y * dt;
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
        // ctx.translate(this.pos.x + this.size.width / 2, this.pos.y + this.size.height / 2);
        // ctx.rotate(Math.PI / 180);
        // ctx.translate(-(this.pos.x + this.size.width / 2), -(this.pos.y + this.size.height / 2));
        let center = { x: this.pos.x + this.size.width / 2, y: this.pos.y + this.size.height / 2 };
        
        ctx.translate(center.x, center.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-center.x, -center.y);

        ctx.fillStyle = "black";
        ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    
        ctx.translate(center.x, center.y);
        ctx.rotate(-(this.rotation * Math.PI / 180));
        ctx.translate(-center.x, -center.y);
    }
}