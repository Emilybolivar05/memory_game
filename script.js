// HTML ELEMENT GRABBERS
const menuContainer = document.querySelector(".menu-container");
const gameContainer = document.querySelector(".game-container");
const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const levelSelect = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");

// CARD IMAGES
const logos = [
  "typescript.png", "swift.png", "sql.png", "python.png",
  "php.png", "nodejs.png", "js.png", "java.png",
  "html5.png", "github.png", "docker.png", "css3.png"
];

// VARIABLES
let flippedCards = [];
let moves = 0;
let timer = 0;
let interval;
let unlockedLevels = ["easy"];

// LEVELS
const levels = {
  easy: { pairs: 8, time: 60 },    //Beginner-friendly
  medium: { pairs: 10, time: 90 }, //Getting tricky
  hard: { pairs: 12, time: 120 }   //Brain-buster!
};

// SOUNDS
const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");


// Shuffle array like a magician
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Create a single card element
function createCard(logo) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">?</div>
      <div class="card-back">
        <img src="images/${logo}" alt="${logo}">
      </div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card, logo));
  return card;
}

// START 
function startGame() {
  const selectedLevel = levelSelect.value;

  // Check if level is unlocked
  if (!unlockedLevels.includes(selectedLevel)) {
    alert("Nivel bloqueado. Completa el anterior primero.");
    return;
  }

  // Check if level is unlocked
  menuContainer.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  const { pairs, time } = levels[selectedLevel];
  moves = 0;
  timer = time;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = timer;

  flippedCards = [];
  gameBoard.innerHTML = "";

 // Determine grid columns by level
  let columns;
  if (selectedLevel === "easy") columns = 4;
  else if (selectedLevel === "medium") columns = 5;
  else columns = 6;

  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; 


  const selectedLogos = logos.slice(0, pairs);
  const gameCards = shuffle([...selectedLogos, ...selectedLogos]);

  gameCards.forEach(logo => {
    const card = createCard(logo);
    gameBoard.appendChild(card);
  });

  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      clearInterval(interval);
      loseSound.currentTime = 0;
      loseSound.play();
      alert("¡Se acabó el tiempo!");
      resetGame();
    }
  }, 1000);
}

// FLIP CARD LOGIC
function flipCard(card, logo) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flipSound.currentTime = 0;
    flipSound.play();
    flippedCards.push({ card, logo });

    if (flippedCards.length === 2) {
      moves++;
      movesDisplay.textContent = moves;
      setTimeout(checkMatch, 500);
    }
  }
}

// CHECK MATCH
function checkMatch() {
  const [first, second] = flippedCards;

  if (first.logo === second.logo) {
      // They match! 
    matchSound.currentTime = 0;
    matchSound.play();
    first.card.style.boxShadow = "0 0 20px gold";
        second.card.style.boxShadow = "0 0 20px gold";

    setTimeout(() => {
      first.card.style.boxShadow = "";
      second.card.style.boxShadow = "";
    }, 500);
  } else {
    // Nope, back to mystery
    first.card.classList.remove("flipped");
    second.card.classList.remove("flipped");
  }

  flippedCards = [];

  // Did we win the level?
  const allFlipped = document.querySelectorAll(".card.flipped").length;
  const totalCards = document.querySelectorAll(".card").length;

  if (allFlipped === totalCards) {
    clearInterval(interval);
    winSound.currentTime = 0;
    winSound.play();
    alert(`¡Ganaste en ${moves} movimientos y ${timer} segundos!`);
    unlockNextLevel(levelSelect.value);
    resetGame()
  }
}

// UNLOCK NEXT LEVEL
function unlockNextLevel(currentLevel) {
  if (currentLevel === "easy" && !unlockedLevels.includes("medium")) {
    unlockedLevels.push("medium");
    document.querySelector('#level option[value="medium"]').disabled = false;
  }
  if (currentLevel === "medium" && !unlockedLevels.includes("hard")) {
    unlockedLevels.push("hard");
    document.querySelector('#level option[value="hard"]').disabled = false;
  }
}

// RESET 
function resetGame() {
  clearInterval(interval);
  gameBoard.innerHTML = "";
  gameContainer.classList.add("hidden");
  menuContainer.classList.remove("hidden");
  flippedCards = [];
  moves = 0;
  timer = 0;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = timer;
}

function resetProgress() {
  unlockedLevels = ["easy"];
  levelSelect.value = "easy"; //Force easy level selection
  alert("¡Progreso reiniciado! Solo el nivel fácil está disponible.");
}


startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);      // Clear board & show menu
resetBtn.addEventListener("click", resetProgress); 
