export default class Entity {
    constructor(pos = {x: 0, y: 0}, size = {width: 10, height: 10}, color = "red") {
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.vel = {x: 0, y: 0};
        this.speed = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.healthBar = null;
        this.isInvincible = false;
        this.invincibleTime = 0;
        this.maxInvincibleTime = 1000;
        this.shouldDelete = false;
    }

    update(dt) {
        this.move(dt);
        if(this.healthBar) {
            this.healthBar.x = this.pos.x + this.size.width/2 - (this.healthBar.lockedWidth ? this.healthBar.lockedWidth/2 : this.maxHealth/2);
            this.healthBar.y = this.pos.y + this.size.height + 10;
            this.healthBar.health = this.health;
            this.healthBar.maxHealth = this.maxHealth;
        }
        this.checkInvincible(dt);
        this.checkDeath();
    }

    checkInvincible(dt) {
        if(this.isInvincible) {
            this.invincibleTime += dt;
            if(this.invincibleTime >= this.maxInvincibleTime) {
                this.isInvincible = false;
            }
        } else {
            this.invincibleTime = 0;
        }
    }

    checkDeath() {
        if(this.health <= 0) {
            this.shouldDelete = true;
        }
    }

    move(dt) {
        this.normailizeVel();

        this.vel.y = Math.min(Math.max(this.vel.y, -this.speed), this.speed);
        this.vel.x = Math.min(Math.max(this.vel.x, -this.speed), this.speed);
        
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    }

    render(ctx) {
        if (this.isInvincible) {
            if (Math.floor(this.invincibleTime / 100) % 2 === 0) return;
        }

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