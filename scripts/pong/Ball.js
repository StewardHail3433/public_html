import Constants from "./Constants.js";

export default class Ball {
    #x;
    #y;
    #radius;
    #xVel = 0;
    #yVel = 0;

    constructor(x, y, radius) {
        this.#x = x;
        this.#y = y;
        this.#radius = radius;
    }

    update() {
        this.#x += this.#xVel;
        this.#y += this.#yVel;

        if (this.#y - this.#radius <= 0 || this.#y + this.#radius >= Constants.HEIGHT) {
            this.#yVel = -this.#yVel;
        }
    }

    render(/** @type {CanvasRenderingContext2D} */ ctx) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(80, 80, 80, 1.0)";
        ctx.arc(this.#x, this.#y, this.#radius, 0, 360);
        ctx.fill();
        ctx.closePath();
    }

    setVel(x, y) {
        this.#xVel = x;
        this.#yVel = y;
    }

    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }

    getXVel() {
        return this.#xVel;
    }

    getYVel() {
        return this.#yVel;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getRadius() {
        return this.#radius;
    }
}