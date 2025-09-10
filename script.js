const board = document.getElementById("game-board");
const movesCounter = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart");

let cardsArray = ['🐶','🐱','🦊','🐼','🐵','🦁','🐸','🐷'];
let gameCards = [...cardsArray, ...cardsArray];
let flippedCards = [];
let moves = 0;
let timer = 0;
let interval;

// Función para barajar
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Crear tablero
function createBoard() {
  board.innerHTML = '';
  shuffle(gameCards).forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
  moves = 0;
  movesCounter.textContent = moves;
  timer = 0;
  timerDisplay.textContent = timer;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

// Voltear carta
function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      moves++;
      movesCounter.textContent = moves;
      setTimeout(checkMatch, 500);
    }
  }
}

// Verificar par
function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }
  flippedCards = [];

  if (document.querySelectorAll('.card.flipped').length === gameCards.length) {
    clearInterval(interval);
    alert(`¡Ganaste en ${moves} movimientos y ${timer} segundos! 🎉`);
  }
}

// Reiniciar juego
restartButton.addEventListener('click', createBoard);

// Iniciar juego
createBoard();