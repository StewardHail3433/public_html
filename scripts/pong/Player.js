import Constants from "./Constants.js";

export default class Player {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #movingUp = false;
    #movingDown = false;
    #controls = {
        up: "",
        down: ""
    };

    constructor(x, y, width, height, controls = { up: "w", down: "s" }) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#controls = controls;
    }

    keyUp(key) {
        if (key === this.#controls.up) {
            this.#movingUp = false;
        }
        if (key === this.#controls.down) {
            this.#movingDown = false;
        }
    }

    keyDown(key) {
        if (key === this.#controls.up) {
            this.#movingUp = true;
        }
        if (key === this.#controls.down) {
            this.#movingDown = true;
        }
    }

    update() {
        if (this.#movingUp) {
            this.#y -= 2;
        }
        if (this.#movingDown) {
            this.#y += 2;
        }

        if (this.#y + this.#height > Constants.HEIGHT) {
            this.#y = Constants.HEIGHT - this.#height;
        }

        if (this.#y < 0) {
            this.#y = 0;
        }
    }

    render(/** @type {CanvasRenderingContext2D} */ ctx,) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(122, 123, 231, 1.0)";
        ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
        ctx.closePath();
    }


    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }

    setWidth(w) {
        this.#width = w;
    }

    setHeight(h) {
        this.#height = h;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }

    isMovingUp() {
        return this.#movingUp;
    }

    isMovingDown() {
        return this.#movingDown;
    }
}