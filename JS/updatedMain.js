// Setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// For ball counter

let counterTag = document.getElementById("counterNum");
let count = 0;

// Creating parent Shape class

class Shape {
  x;
  y;
  velX;
  velY;

  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Creating Ball class

class Ball extends Shape {
  color;
  size;
  exists;

  constructor(x, y, velX, velY, color, size) {
    // The super() needs to be the first statement. Parent constructor
    // must be called first.
    super(x, y, velX, velY);
    this.exists = true;
    this.color = color;
    this.size = size;
  }

  // Method to draw ball onto the screen
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Method to give ball a velocity and deal with border collisions
  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Method to deal with ball to ball collisions
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// Defining class EvilCircle
// Evil circle will eat all other circles. It is controlled by the player/user

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 30;

    // Method to listen to keypress of 'w' 'a' 's' or 'd' to move the ball
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  // Method to draw the evil circle
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Method to deal with border collisions
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }
    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }
    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  // Method that defines evil circle's behavior when it collides with a ball
  // Behavior is to destroy the ball.
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
        }
      }
    }
  }
}

// Initializing evil circle
const badCircle = new EvilCircle(random(0, width), random(0, height));

const balls = [];

while (balls.length <= 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  count++;
}

// Animation function.
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }
  badCircle.draw();
  badCircle.checkBounds();
  badCircle.collisionDetect();
  counterTag.innerHTML = parseInt(count);

  requestAnimationFrame(loop);
}

loop();
