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

// Inicializace nepřátel a skóre
let enemies = [];
let score = 0;

// Klávesy
const keyState = {};

// Funkce pro vykreslení pozadí
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
    const scaledSize = enemy.size * 2;
    ctx.drawImage(enemy.image, enemy.x, enemy.y, scaledSize, scaledSize);
  });
}

// Funkce pro aktualizaci skóre
function drawScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Přidání nového nepřítele
function addEnemy() {
  const size = 100;
  const x = Math.random() * (canvas.width - size);
  const y = Math.random() * (canvas.height - size);
  const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  enemies.push({ x, y, size, image });
}

// Detekce kolize mezi hráčem a nepřáteli
function detectCollisions() {
  enemies = enemies.filter((enemy) => {
    const scaledSize = enemy.size * 2;
    const distance = Math.hypot(player.x - (enemy.x + scaledSize / 2), player.y - (enemy.y + scaledSize / 2));
    if (distance < player.size / 2 + scaledSize / 2) {
      score++;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  handleMovement();
  drawPlayer();
  drawEnemies();
  drawScore();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

// Klávesové události
window.addEventListener("keydown", (e) => (keyState[e.key] = true));
window.addEventListener("keyup", (e) => (keyState[e.key] = false));
document.addEventListener("keydown", () => {
  backgroundMusic.play();
}, { once: true });

// Otevření sidebaru
function openSidebar() {
  document.getElementById("sidebar").style.right = "0";
}

// Zavření sidebaru
document.getElementById("close-btn").onclick = function () {
  document.getElementById("sidebar").style.right = "-250px";
}

// Otevření sidebaru pomocí tlačítka
document.getElementById("open-sidebar-btn").onclick = function () {
  openSidebar();
}

// Spuštění hry
addEnemy();
startBackgroundMusic();
gameLoop();
