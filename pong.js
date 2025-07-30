let slowMo = false;
window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "o") slowMo = true;
});
window.addEventListener("keyup", e => {
    if (e.key.toLowerCase() === "o") slowMo = false;
});



class PongGame {
    constructor(canvas, controlKeys) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width = 300;
        this.height = canvas.height = 300;

        this.paddleHeight = 40;
        this.paddleWidth = 8;

        this.leftPaddleY = this.height / 2 - this.paddleHeight / 2;
        this.rightPaddleY = this.height / 2 - this.paddleHeight / 2;

        this.ball = {
            x: this.width / 2,
            y: this.height / 2,
            vx: 2 + Math.random() * 2,
            vy: 2 - Math.random() * 4,
            radius: 5
        };
        this.leftScore = 0;
        this.rightScore = 0;
        this.visible = true; // Controlled externally


        this.controlKeys = controlKeys; // { up: 'a', down: 'z' }
        this.movement = 0;

        window.addEventListener("keydown", (e) => this.handleKey(e, true));
        window.addEventListener("keyup", (e) => this.handleKey(e, false));

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    handleKey(e, isDown) {
        const key = e.key.toLowerCase();
        if (key === this.controlKeys.up) {
            this.movement = isDown ? -5 : 0;
        } else if (key === this.controlKeys.down) {
            this.movement = isDown ? 5 : 0;
        }
    }

    update() {
        if (!this.visible) return; // Skip logic when face not visible

        const speedFactor = slowMo ? 0.25 : 1;

        const b = this.ball;
        b.x += b.vx * speedFactor;
        b.y += b.vy * speedFactor;

        if (b.y < 0 || b.y > this.height) b.vy *= -1;

        // Left paddle
        this.leftPaddleY += this.movement * speedFactor;
        this.leftPaddleY = Math.max(0, Math.min(this.height - this.paddleHeight, this.leftPaddleY));

        // Right paddle (AI)
        const target = b.y - this.paddleHeight / 2;
        this.rightPaddleY += (target - this.rightPaddleY) * 0.05 * speedFactor;

        // Collisions
        if (
            b.x - b.radius < this.paddleWidth &&
            b.y > this.leftPaddleY &&
            b.y < this.leftPaddleY + this.paddleHeight
        ) {
            b.vx *= -1;
            b.x = this.paddleWidth + b.radius;
        }

        if (
            b.x + b.radius > this.width - this.paddleWidth &&
            b.y > this.rightPaddleY &&
            b.y < this.rightPaddleY + this.paddleHeight
        ) {
            b.vx *= -1;
            b.x = this.width - this.paddleWidth - b.radius;
        }

        // Scoring
        if (b.x < 0) {
            this.rightScore++;
            this.resetBall();
        } else if (b.x > this.width) {
            this.leftScore++;
            this.resetBall();
        }

    }

    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random());
        this.ball.vy = 2 - Math.random() * 4;
    }


    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Paddles
        ctx.fillStyle = "white";
        ctx.fillRect(0, this.leftPaddleY, this.paddleWidth, this.paddleHeight);
        ctx.fillRect(this.width - this.paddleWidth, this.rightPaddleY, this.paddleWidth, this.paddleHeight);

        // Ball
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Score
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(`${this.leftScore} : ${this.rightScore}`, this.width / 2 - 20, 20);

    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

function isFaceVisible(face, rotationY, rotationX) {
    const faceRotations = {
      "face-front":  { y:   0, x:   0 },
      "face-back":   { y: 180, x:   0 },
      "face-left":   { y: -90, x:   0 },
      "face-right":  { y:  90, x:   0 },
      "face-top":    { y:   0, x: -90 },
      "face-bottom": { y:   0, x:  90 }
    };
  
    const ideal = faceRotations[face];
    if (!ideal) return false;
  
    const dy = Math.abs(((rotationY - ideal.y + 180) % 360) - 180);
    const dx = Math.abs(((rotationX - ideal.x + 180) % 360) - 180);
  
    // New logic: consider face visible if within ±90 degrees
    return dx < 90 && dy < 90;
  }
  


const controlMap = {
    "face-front": { up: "a", down: "z" },
    "face-back": { up: "s", down: "x" },
    "face-left": { up: "d", down: "c" },
    "face-right": { up: "f", down: "v" },
    "face-top": { up: "g", down: "b" },
    "face-bottom": { up: "h", down: "n" }
};

const faceGames = {};

Object.entries(controlMap).forEach(([id, keys]) => {
    const canvas = document.querySelector(`#${id} canvas`);
    faceGames[id] = new PongGame(canvas, keys);
});




let rotationX = 0;
let rotationY = 0;

function rotateCube() {
    rotationX += 0.3;
    rotationY += 0.5;

    document.querySelector(".cube").style.transform = `
    rotateX(${rotationX}deg)
    rotateY(${rotationY}deg)
  `;

    // Update game visibility
    Object.entries(faceGames).forEach(([faceId, game]) => {
        game.visible = isFaceVisible(faceId, rotationY % 360, rotationX % 360);
    });

    requestAnimationFrame(rotateCube);
}


rotateCube();