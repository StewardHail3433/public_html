import UIElement from "./UiElement.js";

export default class HealthBarElement extends UIElement {
    constructor(x, y, health, maxHealth, lockedWidth = null) {
        super(x, y);
        this.health = health;
        this.maxHealth = maxHealth;
        this.lockedWidth = lockedWidth
    }

    render(ctx) {
        ctx.fillStyle = "lightgrey"
        if(this.lockedWidth != null)
            ctx.fillRect(this.x,this.y, this.lockedWidth, 15)
        else
            ctx.fillRect(this.x,this.y, this.maxHealth, 15)

        ctx.fillStyle = "crimson"
        if(this.lockedWidth != null)
            ctx.fillRect(this.x+2,this.y+2, this.lockedWidth-2, 11)
        else
            ctx.fillRect(this.x+2,this.y+2, this.maxHealth-2, 11)

        ctx.fillStyle = "lawngreen";
        if(this.lockedWidth != null)
            ctx.fillRect(this.x+2,this.y+2, (this.health/this.maxHealth) * (this.lockedWidth-2), 11)
        else
            ctx.fillRect(this.x+2,this.y+2, (this.health/this.maxHealth) * (this.maxHealth-2), 11)
    }
}