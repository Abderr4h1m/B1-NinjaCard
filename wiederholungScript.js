// Get the selected part
const teil = localStorage.getItem("wTeil") || "teil1";
const cards = data[teil];
let currentIndex = 0;

const cardFront = document.getElementById("w-card-front");
const cardBack = document.getElementById("w-card-back");

// Show a card
function showCard(index) {
  if (index < 0) index = cards.length - 1;
  if (index >= cards.length) index = 0;
  currentIndex = index;

  const card = cards[currentIndex];
  cardFront.textContent = card.word; // Front shows word
  cardBack.textContent = card.number; // Back shows number
}

// Next / Previous
function nextCard() {
  showCard(currentIndex + 1);
}

function prevCard() {
  showCard(currentIndex - 1);
}

// Initialize first card
showCard(currentIndex);
