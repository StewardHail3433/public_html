import TextElement from "./TextElement.js";

export default class AlertTextElement extends TextElement {

  constructor(text, x, y, speed = 0.05, font = 'Arial', color = 'black', size = 20, align = 'left', ) {
    super(text, x, y, font, color, size = 20, align);
    this.alpha = 1;
    this.fadeDuration = 120; // frames
    this.speed = speed;
  }

  move(dt) {
    this.y -= this.speed * dt;
  }

  update(dt) {
    this.move(dt);
    this.alpha -= 1 / this.fadeDuration;
    if (this.alpha < 0) {
      this.alpha = 0;
    }

    if(this.isFadedOut()) {
      delete this;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    super.render(ctx);
    ctx.restore();
  }

  isFadedOut() {
    return this.alpha === 0;
  }

}