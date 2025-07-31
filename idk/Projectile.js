class Projectile {
    constructor(pos = {x: 0, y: 0}, size = {width: 10, height: 10}, target = {x: number, y: number}) {
        this.pos = pos;
        this.size = size;
        this.target = target;
        this.vel = {x: 0, y: 0};
    }

    onEntityHit(entity) {

    }

    onProjectileHit(projectile) {

    }
}