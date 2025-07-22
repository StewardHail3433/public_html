// class Constants {
//     static WIDTH = 500;
//     static HEIGHT = 500;
// }

// class Ball {
//     #x;
//     #y;
//     #radius;
//     #xVel = 0;
//     #yVel = 0;
//     color = {r: 123, g:123, b:123};

//     constructor(x, y, radius) {
//         this.#x = x;
//         this.#y = y;
//         this.#radius = radius;
//     }

//     update() {
//         this.#x += this.#xVel;
//         this.#y += this.#yVel;

//         if(this.#y - this.#radius <= 0 || this.#y + this.#radius >= Constants.HEIGHT) {
//             this.#yVel = -this.#yVel;
//         }

//         if(this.#x - this.#radius <= 0 || this.#x + this.#radius >= Constants.WIDTH) {
//             this.#xVel = -this.#xVel;
//         }
//     }

//     render(/** @type {CanvasRenderingContext2D} */ ctx) {
//         ctx.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
//         ctx.arc(this.#x, this.#y, this.#radius, 0, 360);
//         ctx.fill();
//     }

//     setVel(x, y) {
//         this.#xVel = x;
//         this.#yVel = y;
//     }

//     setcolor(r, g, b) {
//         this.color.r = r;
//         this.color.g = g;
//         this.color.b = b;
//     }

//     setX(x) {
//         this.#x = x;
//     }

//     setY(y) {
//         this.#x = y;
//     }

//     getXVel() {
//         return this.#xVel;
//     }

//     getYVel() {
//         return this.#yVel;
//     }

//     getX() {
//         return this.#x;
//     }

//     getY() {
//         return this.#y;
//     }

//     getRadius() {
//         return this.#radius;
//     }
// }

// class Player {
//     #x = 0;
//     #y = 0;
//     #width = 0;
//     #height = 0;
//     #movingUp = false;
//     #movingDown = false;
//     #controls = {
//         up: "",
//         down: ""
//     };

//     constructor(x, y, width, height, controls = { up: "w", down: "s" }) {
//         this.#x = x;
//         this.#y = y;
//         this.#width = width;
//         this.#height = height;
//         this.#controls = controls;
//     }

//     keyUp(key) {
//         if (key === this.#controls.up) {
//             this.#movingUp = false;
//         }
//         if (key === this.#controls.down) {
//             this.#movingDown = false;
//         }
//     }

//     keyDown(key) {
//         if (key === this.#controls.up) {
//             this.#movingUp = true;
//         }
//         if (key === this.#controls.down) {
//             this.#movingDown = true;
//         }
//     }

//     update() {
//         if (this.#movingUp) {
//             this.#y -= 2;
//         }
//         if (this.#movingDown) {
//             this.#y += 2;
//         }
//         if (this.#y + this.#height > Constants.HEIGHT) {
//             this.#y = Constants.HEIGHT - this.#height;
//         }

//         if (this.#y < 0) {
//             this.#y = 0;
//         }
//     }

//     render(/** @type {CanvasRenderingContext2D} */ ctx,) {
//         ctx.beginPath();
//         ctx.fillStyle = "rgba(122, 123, 231, 1.0)";
//         ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
//         ctx.closePath();
//     }


//     setX(x) {
//         this.#x = x;
//     }

//     setY(y) {
//         this.#y = y;
//     }

//     setWidth(w) {
//         this.#width = w;
//     }

//     setHeight(h) {
//         this.#height = h;
//     }

//     getX() {
//         return this.#x;
//     }

//     getY() {
//         return this.#y;
//     }

//     getWidth() {
//         return this.#width;
//     }

//     getHeight() {
//         return this.#height;
//     }

//     isMovingUp() {
//         return this.#movingUp;
//     }

//     isMovingDown() {
//         return this.#movingDown;
//     }
// }
import Player from "./Player.js";
import Ball from "./Ball.js";
import Constants from "./Constants.js";

const WIDTH = Constants.WIDTH;
const HEIGHT = Constants.HEIGHT;
/** @type {HTMLCanvasElement} */const canvas = document.getElementById('pong');
canvas.style = "padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; width: ${WIDTH}px; height: ${HEIGHT}px"
canvas.width = WIDTH;
canvas.height = HEIGHT;
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');

const player1 = new Player(0, 0, 10, 100);
const player2 = new Player(WIDTH - 10, 0, 10, 100, { up: "ArrowUp", down: "ArrowDown" });
const score = [0, 0]

const ball = new Ball(250, 250, 5);
let start = false
canvas.addEventListener("click", () => {
    canvas.focus()
    if (!start) {
        setTimeout(() => {
            ball.setVel(ball.getXVel() > 0 ? -2 : 2, Math.random() > 0.5 ? 1 : -1);
        }, 500);
        start = true;
    }
    requestAnimationFrame(gameLoop);
})
document.addEventListener("click", (event) => {
    if (event.target.id != canvas.id) {
        canvas.blur();
        console.log(event.target, canvas, document.activeElement);
    }

})
document.addEventListener("keydown", (event) => {
    if (document.activeElement != canvas)
        return;
    event.preventDefault();
    player1.keyDown(event.key);
    player2.keyDown(event.key);

    if (event.key === "1")
        ball.setVel(ball.getXVel() + 1, ball.getYVel())
    else if (event.key === "2")
        ball.setVel(ball.getXVel() - 1, ball.getYVel())
    else if (event.key === "3")
        ball.setVel(ball.getXVel(), ball.getYVel() + 1)
    else if (event.key === "4")
        ball.setVel(ball.getXVel(), ball.getYVel() - 1)
    else if (event.key === "5")
        ball.setVel(0, 0)
})

document.addEventListener("keyup", (event) => {
    if (document.activeElement != canvas)
        return;
    event.preventDefault();
    player1.keyUp(event.key);
    player2.keyUp(event.key);
})

function render() {

    // Clear
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255 ,1.0)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0 , 1.0)";
    ctx.fillText(score[0] + " : " + score[1], Constants.WIDTH / 2 - ctx.measureText(score[0] + " : " + score[1]).width / 2, 250)
    ctx.closePath();
    // Render Player
    player1.render(ctx);
    player2.render(ctx);

    ball.render(ctx);
}

function update() {
    //Update Player
    player1.update();
    player2.update();

    if (ball.getX() - ball.getRadius() <= 0) {
        score[1]++;
        reset();

    } else if (ball.getX() + ball.getRadius() >= Constants.WIDTH) {
        score[0]++;
        reset();
    }
    else {
        ball.update();

        collisionChecker();
    }


}

function reset() {
    ball.setVel(0, 0);
    ball.setX(WIDTH / 2);
    ball.setY(HEIGHT / 2);

    setTimeout(() => {
        ball.setVel(ball.getXVel() > 0 ? -2 : 2, Math.random() > 0.5 ? 1 : -1);
    }, 500);
}

function collisionChecker() {
    const players = [player1, player2];
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        let nearestX = Math.max(player.getX(), Math.min(ball.getX(), player.getX() + player.getWidth()));
        let nearestY = Math.max(player.getY(), Math.min(ball.getY(), player.getY() + player.getHeight()));


        let deltaX = ball.getX() - nearestX;
        let deltaY = ball.getY() - nearestY;
        let distanceSq = (deltaX * deltaX) + (deltaY * deltaY);

        // console.log(i, distance);
        if (distanceSq <= ball.getRadius() * ball.getRadius()) {
            calcNewBallVel(player);
            return;
        }
    }
}

function calcNewBallVel(player) {
    const MAX_BOUNCE_ANGLE = 5 * Math.PI / 12; // 75 degrees
    const relativeIntersectY = (player.getY() + (player.getHeight() / 2)) - ball.getY();
    const normalizedRelativeIntersectionY = (relativeIntersectY / (player.getHeight() / 2));
    const bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE;

    const currentSpeed = Math.sqrt(ball.getXVel() * ball.getXVel() + ball.getYVel() * ball.getYVel());
    const newSpeed = Math.min(currentSpeed + 0.2, 7); // Increase speed on hit, with a max

    const direction = ball.getXVel() > 0 ? -1 : 1;

    ball.setVel(direction * newSpeed * Math.cos(bounceAngle), -newSpeed * Math.sin(bounceAngle));

}

function gameLoop() {
    if (document.activeElement == canvas) {
        update()
        render()
        requestAnimationFrame(gameLoop);
    }
}

render();
canvas.tabIndex = 0;
