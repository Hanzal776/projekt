let dingSound = new Audio("Kolize.mp3");  // Načteme zvuk
// Zvukové efekty a hudba
let dingSound = new Audio("Kolize.mp3");
const backgroundMusic = document.getElementById("backgroundMusic");
let winSound = new Audio("vyhra.mp3");

// Plátno a jeho nastavení
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const backgroundMusic = document.getElementById("backgroundMusic");
// Plátno se přizpůsobí velikosti okna
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Načtení obrázků
const playerImg = new Image();
playerImg.src = "bender.png";
// Zobrazení skóre
const scoreDisplay = document.getElementById("score");

// Načtení obrázků
const enemyImages = ["blood.png", "thunder.png", "fire.png", "mango.png", "venom.png"].map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

// Načtení obrázku pozadí
const backgroundImg = new Image();
backgroundImg.src = "background.png";

// Nastavení hráče
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 200,
  speed: 10,
};
const playerImg = new Image();
playerImg.src = "bender.png";

// Inicializace nepřátel a skóre
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

// Funkce pro vykreslení pozadí
// Funkce pro vykreslení
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Funkce pro hudbu do pozadí
function startBackgroundMusic() {
  backgroundMusic.volume = 1;
  backgroundMusic.play();
}
// Funkce pro vykreslení hráče
function drawPlayer() {
  ctx.drawImage(playerImg, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}
// Funkce pro vykreslení nepřátel
function drawEnemies() {
  enemies.forEach((enemy) => {
    const scaledSize = enemy.size;
    ctx.drawImage(enemy.image, enemy.x, enemy.y, scaledSize, scaledSize);
    enemy.draw();
  });
}

// Funkce pro aktualizaci skóre
function drawScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Přidání nového nepřítele
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
  const size = 150;
  const x = Math.random() * (canvas.width - size);
  const y = Math.random() * (canvas.height - size);
  const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];
  this.size = 150;
  this.x = Math.random() * (canvas.width - size);
  this.y = Math.random() * (canvas.height - size);
  this.image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  enemies.push({ x, y, size, image });
  enemies.push(new Enemy(x, y, size, image));
}

// Detekce kolize mezi hráčem a nepřáteli
// Kolize
function detectCollisions() {
  enemies = enemies.filter((enemy) => {
    const scaledSize = enemy.size;
    const distance = Math.hypot(player.x - (enemy.x + scaledSize / 2), player.y - (enemy.y + scaledSize / 2));
    if (distance < player.size / 2 + scaledSize / 2) {
    const distance = Math.hypot(player.x - (enemy.x + enemy.size / 2), player.y - (enemy.y + enemy.size / 2));
    if (distance < player.size / 2 + enemy.size / 2) {
      score++;
      dingSound.currentTime = 0; 
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

// Pohyb hráče
function handleMovement() {
  if (keyState["a"] && player.x - player.size / 2 > 0) player.x -= player.speed;
  if (keyState["d"] && player.x + player.size / 2 < canvas.width) player.x += player.speed;
  if (keyState["w"] && player.y - player.size / 2 > 0) player.y -= player.speed;
  if (keyState["s"] && player.y + player.size / 2 < canvas.height) player.y += player.speed;
}
// Herní smyčka
function gameLoop() {
  if (gameWon) {
    showWinScreen();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  handleMovement();
  drawPlayer();
  player.move(keyState);
  player.draw();
  drawEnemies();
  drawScore();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

// Klávesové události
window.addEventListener("keydown", (e) => (keyState[e.key] = true));
window.addEventListener("keyup", (e) => (keyState[e.key] = false));
document.addEventListener("keydown", () => {
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
}, { once: true });
// Otevření sidebaru
function openSidebar() {
  document.getElementById("sidebar").style.right = "0";
  addEnemy(); 
  gameLoop();
}

// Zavření sidebaru
document.getElementById("close-btn").onclick = function () {
  document.getElementById("sidebar").style.right = "-250px";
// Hudba
function startBackgroundMusic() {
  backgroundMusic.volume = 0.3;
  backgroundMusic.play();
}

// Otevření sidebaru pomocí tlačítka
document.getElementById("open-sidebar-btn").onclick = function () {
  openSidebar();
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
