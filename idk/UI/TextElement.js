import UIElement from "./UiElement.js";

export default class TextElement extends UIElement {
    constructor(text, x, y, font = 'Arial', color = 'white', size = 20, align = 'left') {
        super(x, y);
        this.text = text;
        this.font = font;
        this.color = color;
        this.size = size;
        this.align = align;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx) {
        super.render(ctx)
        ctx.font = `${this.size}px ${this.font}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.fillText(this.text, this.x, this.y);
    }

    updateText(text) {
        this.text = text;
    }

}