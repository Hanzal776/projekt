// Zvukové efekty a hudba
let dingSound = new Audio("Kolize.mp3");
const backgroundMusic = document.getElementById("backgroundMusic");
let winSound = new Audio("vyhra.mp3");

// Plátno a jeho nastavení
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Zobrazení skóre
const scoreDisplay = document.getElementById("score");

// Načtení obrázků
const enemyImages = ["blood.png", "thunder.png", "fire.png", "mango.png", "venom.png"].map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

const backgroundImg = new Image();
backgroundImg.src = "background.png";

const playerImg = new Image();
playerImg.src = "bender.png";

const winImg = new Image();
winImg.src = "vyhra.png";

// Třída hráče
class Player {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    ctx.drawImage(playerImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  move(keyState) {
    if (keyState["a"] && this.x - this.size / 2 > 0) this.x -= this.speed;
    if (keyState["d"] && this.x + this.size / 2 < canvas.width) this.x += this.speed;
    if (keyState["w"] && this.y - this.size / 2 > 0) this.y -= this.speed;
    if (keyState["s"] && this.y + this.size / 2 < canvas.height) this.y += this.speed;
  }
}

// Třída nepřítele
class Enemy {
  constructor(x, y, size, image) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

// Inicializace hráče a nepřátel
const player = new Player(canvas.width / 2, canvas.height / 2, 200, 10);
let enemies = [];
let score = 0;
let gameWon = false;

// Klávesy
const keyState = {};

// Funkce pro vykreslení
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    enemy.draw();
  });
}

function drawScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function showWinScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(winImg, 0, 0, canvas.width, canvas.height);
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  winSound.volume = 1;
  winSound.play();
}

// Přidání nepřátel
function addEnemy() {
  this.size = 150;
  this.x = Math.random() * (canvas.width - size);
  this.y = Math.random() * (canvas.height - size);
  this.image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  enemies.push(new Enemy(x, y, size, image));
}

// Kolize
function detectCollisions() {
  enemies = enemies.filter((enemy) => {
    const distance = Math.hypot(player.x - (enemy.x + enemy.size / 2), player.y - (enemy.y + enemy.size / 2));
    if (distance < player.size / 2 + enemy.size / 2) {
      score++;
      dingSound.currentTime = 0;
      dingSound.volume = 0.5;
      dingSound.play();
      if (score >= 30) {
        gameWon = true;
      }
      setTimeout(addEnemy, 0);
      return false;
    }
    return true;
  });
}

// Herní smyčka
function gameLoop() {
  if (gameWon) {
    showWinScreen();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  player.move(keyState);
  player.draw();
  drawEnemies();
  drawScore();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

// Restart hry
function restartGame() {
  score = 0; 
  scoreDisplay.textContent = `Score: ${score}`;
  enemies = [];
  gameWon = false; 
  player.x = canvas.width / 2; 
  player.y = canvas.height / 2; 
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  backgroundMusic.play();
  addEnemy(); 
  gameLoop();
}

// Hudba
function startBackgroundMusic() {
  backgroundMusic.volume = 0.3;
  backgroundMusic.play();
}

// Události kláves
window.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
  if (gameWon && e.key === "Enter") {
    restartGame();
  }
});

window.addEventListener("keyup", (e) => (keyState[e.key] = false));
document.addEventListener("keydown", () => {
  backgroundMusic.play();
}, { once: true });

// Spuštění hry
addEnemy();
startBackgroundMusic();
gameLoop();
