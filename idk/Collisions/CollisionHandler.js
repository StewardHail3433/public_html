import Utils from "../utils/Utils.js"

function checkProjectileCollision(entity, projectiles) {
    if (!entity.isInvincible) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            if (Utils.containEdge(Utils.getCorners(entity.pos.x, entity.pos.y, entity.size.width, entity.size.height), Utils.getCorners(projectile.pos.x, projectile.pos.y, projectile.size.width, projectile.size.height, projectile.rotation * Math.PI / 180))) {
                entity.health -= projectile.damage;
                entity.isInvincible = true;
                entity.invincibleTime = 0;
                return projectile.damage;
            }
        }
    }
}

function checkPlayerEnemyCollision(player, enemy) {
    if (!player.isInvincible) {
        if (Utils.containBox({...player.pos, ...player.size}, {...enemy.pos, ...enemy.size})) {
            player.health -= enemy.damage;
            player.isInvincible = true;
            player.invincibleTime = 0;
            return enemy.damage;
        }
    }
}

export default {
    checkProjectileCollision,
    checkPlayerEnemyCollision
}