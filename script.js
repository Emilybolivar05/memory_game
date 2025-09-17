const board = document.getElementById("game-board");
const movesCounter = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart");
const levelSelect = document.getElementById("level");
const startButton = document.getElementById("start-game");
const recordDiv = document.getElementById("record");

let cardsArray = [
  'typescript.png','swift.png','sql.png','python.png','php.png','nodejs.png',
  'js.png','java.png','html5.png','github.png','docker.png','css3.png'
];
let gameCards = [];
let flippedCards = [];
let moves = 0;
let timer = 0;
let interval;
let currentLevel = 'easy';
let boardLocked = false;

// part of levels
const levels = {
  easy: { pairs: 4, time: 60 },
  medium: { pairs: 8, time: 90 },
  hard: { pairs: 12, time: 110 }
};

// part of sounds
const flipSound = new Audio('sounds/flip.mp3');
flipSound.preload = 'auto';
const matchSound = new Audio('sounds/match.mp3');
matchSound.preload = 'auto';
const winSound = new Audio('sounds/win.mp3');
winSound.preload = 'auto';
const loseSound = new Audio('sounds/lose.mp3');
loseSound.preload = 'auto';

// part of events, actions
startButton.addEventListener('click', () => {
  currentLevel = levelSelect.value;
  setupGame();
});
restartButton.addEventListener('click', setupGame);

// shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// conf game
function setupGame() {
  const { pairs, time } = levels[currentLevel];

  const record = JSON.parse(localStorage.getItem(`record-${currentLevel}`));
  recordDiv.textContent = record
    ? `Mejor récord: ${record.moves} movimientos, ${record.time} segundos`
    : `Mejor récord: -`;


  const selectedCards = cardsArray.slice(0, pairs);
  gameCards = [...selectedCards, ...selectedCards];

  // create dashboard
  board.innerHTML = '';
  board.className = 'game-board';
  board.classList.add(currentLevel);

  shuffle(gameCards).forEach(image => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="images/${image}" alt="logo">
        </div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  // reset counters
  moves = 0;
  movesCounter.textContent = moves;

  // timer
  clearInterval(interval);
  timer = time;
  timerDisplay.textContent = timer;
  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      clearInterval(interval);
      alert('¡Se acabó el tiempo! 😢');
      loseSound.currentTime = 0;
      loseSound.play();
      board.innerHTML = '';
    }
  }, 1000);

  flippedCards = [];
  boardLocked = false;
}

// function flip card
function flipCard() {
  if (boardLocked) return;
  if (flippedCards.includes(this) || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  flipSound.currentTime = 0;
  flipSound.play();

  if (flippedCards.length === 2) {
    moves++;
    movesCounter.textContent = moves;
    boardLocked = true;
    setTimeout(checkMatch, 800);
  }
}

// see if there is a match or not
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchSound.currentTime = 0;
    matchSound.play();

    card1.style.boxShadow = '0 0 30px gold';
    card2.style.boxShadow = '0 0 30px gold';
    setTimeout(() => {
      card1.style.boxShadow = '';
      card2.style.boxShadow = '';
    }, 500);
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }, 500);
  }

  flippedCards = [];
  boardLocked = false;

  // Check game over
  if (document.querySelectorAll('.card.flipped').length === gameCards.length) {
    clearInterval(interval);
    alert(`¡Ganaste en ${moves} movimientos y ${timer} segundos! 🎉`);
    winSound.currentTime = 0;
    winSound.play();
    saveRecord(currentLevel, moves, timer);
  }
}

// save some records
function saveRecord(level, moves, time) {
  const record = JSON.parse(localStorage.getItem(`record-${level}`));

  if (!record || moves < record.moves || (moves === record.moves && time < record.time)) {
    const newRecord = { moves, time };
    localStorage.setItem(`record-${level}`, JSON.stringify(newRecord));
    alert(`¡Nuevo récord para el nivel ${level.toUpperCase()}! 🏆`);
  }
}
