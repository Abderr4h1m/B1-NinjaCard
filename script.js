// Game state
let currentTeil = "";
let cards = [];
let currentIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// Get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Start game with selected teil
function startGame(teil) {
  currentTeil = teil;
  localStorage.setItem("currentTeil", teil);
  window.location.href = "ninjaGame.html";
}

// Shuffle helper
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize game page
function initGamePage() {
  if (window.location.pathname.includes("ninjaGame.html")) {
    currentTeil = localStorage.getItem("currentTeil") || "teil1";
    cards = shuffleArray([...data[currentTeil]]);
    currentIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    loadCard();

    // Allow Enter key to submit
    document
      .getElementById("answer-input")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          checkAnswer();
        }
      });
  }
}

// Load current card
function loadCard() {
  if (currentIndex >= cards.length) {
    // Save results to localStorage
    localStorage.setItem("correctAnswers", correctAnswers);
    localStorage.setItem("wrongAnswers", wrongAnswers);
    localStorage.setItem("currentTeil", currentTeil);
    window.location.href = "ninjaresult.html";
    return;
  }

  const card = cards[currentIndex];
  document.getElementById("card-front").textContent = card.word;
  document.getElementById("card-back").textContent = card.number;

  // Reset card state
  const cardElement = document.getElementById("current-card");
  cardElement.className = "card";
  document.getElementById("answer-input").value = "";
  document.getElementById("answer-input").focus();
}

function updateProgress() {
  const progressBar = document.getElementById("progress-bar");
  const percentage = ((currentIndex + 1) / cards.length) * 100;
  progressBar.style.width = percentage + "%";
}

function checkAnswer() {
  const input = document.getElementById("answer-input");
  const answer = parseInt(input.value);
  const card = cards[currentIndex];
  const cardElement = document.getElementById("current-card");
  const cardBack = document.getElementById("card-back"); // ✅ target the back face

  if (isNaN(answer)) {
    alert("Bitte gib eine gültige Zahl ein!");
    return;
  }

  // Flip card
  cardElement.classList.add("flipped");

  // Reset styles first
  cardBack.classList.remove("correct", "incorrect");

  // Check if answer is correct
  if (answer === card.number) {
    cardBack.classList.add("correct"); // ✅ apply to cardBack
    correctAnswers++;
  } else {
    cardBack.classList.add("incorrect"); // ✅ apply to cardBack
    wrongAnswers++;
  }

  // Disable input and button temporarily
  input.disabled = true;
  document.querySelector("#game-page button").disabled = true;

  // After animation, move to next card
  setTimeout(() => {
    cardElement.classList.add("swiping");

    setTimeout(() => {
      currentIndex++;
      loadCard();
      updateProgress();
      // Re-enable input and button
      if (currentIndex < cards.length) {
        input.disabled = false;
        document.querySelector("#game-page button").disabled = false;
      }
    }, 500);
  }, 1000);
}

// Initialize result page
function initResultPage() {
  if (window.location.pathname.includes("ninjaresult.html")) {
    let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    let wrongAnswers = parseInt(localStorage.getItem("wrongAnswers")) || 0;
    let currentTeil = localStorage.getItem("currentTeil") || "teil1";

    const total = correctAnswers + wrongAnswers;
    const percentage =
      total > 0 ? Math.round((correctAnswers / total) * 100) : 0;

    document.getElementById(
      "score-text"
    ).textContent = `Richtig: ${correctAnswers} | Falsch: ${wrongAnswers}`;
    document.getElementById(
      "percentage-text"
    ).textContent = `Prozentsatz: ${percentage}%`;

    let motivation = "";
    let bgColor = "";

    if (percentage === 100) {
      motivation = "Wahrer Ninja"; // Best score
      bgColor = "rgba(46, 204, 113, 0.8)";
    } else if (percentage >= 80) {
      motivation = "Starker Ninja"; // Very good
      bgColor = "rgba(52, 152, 219, 0.8)";
    } else if (percentage >= 60) {
      motivation = "Der Weg des Ninja hat begonnen"; // Training stage
      bgColor = "rgba(241, 196, 15, 0.8)";
    } else {
      // Use the ninja image instead of text
      motivation = `<img src="assets/ninjaText.png" alt="Ninjas geben nie auf" class="nichtauf"">`;
      bgColor = "rgba(231, 76, 60, 0.8)";
    }

    const motivationElement = document.getElementById("motivation-text");
    motivationElement.innerHTML = motivation; // allows <img>
    motivationElement.style.backgroundColor = bgColor;
  }
}

// Restart game
function restartGame() {
  localStorage.removeItem("currentTeil");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("wrongAnswers");
  window.location.href = "ninjaCards.html";
}

// Initialize appropriate page
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("ninjaGame.html")) {
    initGamePage();
  } else if (window.location.pathname.includes("ninjaresult.html")) {
    initResultPage();
  }
});
