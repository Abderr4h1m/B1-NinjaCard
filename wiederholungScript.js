const teil = localStorage.getItem("wTeil") || "teil1";
const cards = data[teil];
let currentIndex = 0;

const cardFront = document.getElementById("w-card-front");
const cardBack = document.getElementById("w-card-back");
const card = document.getElementById("w-current-card");

function showCard(index) {
  if (index < 0) index = cards.length - 1;
  if (index >= cards.length) index = 0;
  currentIndex = index;

  const current = cards[currentIndex];
  cardFront.textContent = current.word;
  cardBack.textContent = current.number;

  // Reset flip when changing card
  card.classList.remove("flipped");
}

function nextCard() {
  showCard(currentIndex + 1);
}

function prevCard() {
  showCard(currentIndex - 1);
}

function flipCard() {
  card.classList.toggle("flipped");
}

// Initialize first card
showCard(currentIndex);
