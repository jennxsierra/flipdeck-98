document.addEventListener("DOMContentLoaded", async () => {
  let flashcards = [];
  let currentCardIndex = 0;
  let isFront = true;
  let seconds = 0;
  let timerInterval = null;
  let timerRunning = false;

  const cardContent = document.getElementById("card-content");
  const cardCounter = document.getElementById("card-counter");
  const flipCard = document.getElementById("flip-card");
  const startTimerBtn = document.getElementById("start-timer");
  const pauseTimerBtn = document.getElementById("pause-timer");
  const resetTimerBtn = document.getElementById("reset-timer");
  const timerDisplay = document.getElementById("timer");
  const prevCardButton = document.getElementById("prev-card");
  const nextCardButton = document.getElementById("next-card");

  // Fetch flashcards from the server
  try {
    const response = await fetch("/api/flashcards");
    if (!response.ok) throw new Error("Failed to fetch flashcards");
    flashcards = await response.json();
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    cardContent.textContent = "Failed to load flashcards.";
    cardCounter.textContent = "0 of 0";
    return;
  }

  // Update the card display
  const updateCardDisplay = () => {
    const currentCard = flashcards[currentCardIndex];

    // Always update both sides, regardless of which is showing
    cardContent.textContent = currentCard.prompt; // Front side
    const cardAnswer = document.getElementById("card-answer");
    cardAnswer.textContent = currentCard.answer; // Back side

    cardCounter.textContent = `${currentCardIndex + 1} of ${flashcards.length}`;

    // Reset card flip state if front side is showing
    if (isFront && flipCard.classList.contains("flipped")) {
      flipCard.classList.remove("flipped");
    } else if (!isFront && !flipCard.classList.contains("flipped")) {
      flipCard.classList.add("flipped");
    }

    // Update progress bar
    const progressBar = document.getElementById("study-progress");
    const progressPercentage =
      ((currentCardIndex + 1) / flashcards.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  };

  // Timer Functions
  const startTimer = () => {
    if (timerInterval) return; // Don't create multiple intervals

    timerRunning = true;
    startTimerBtn.classList.add("active");
    pauseTimerBtn.classList.remove("active");

    timerInterval = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  };

  const pauseTimer = () => {
    timerRunning = false;
    startTimerBtn.classList.remove("active");
    pauseTimerBtn.classList.add("active");

    clearInterval(timerInterval);
    timerInterval = null;
  };

  const resetTimer = () => {
    seconds = 0;
    updateTimerDisplay();

    // If the timer was running, restart it
    if (timerRunning) {
      pauseTimer();
      startTimer();
    }
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Add event listeners for timer controls
  startTimerBtn.addEventListener("click", startTimer);
  pauseTimerBtn.addEventListener("click", pauseTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  // Initialize the buttons with correct states
  startTimerBtn.classList.remove("active");
  pauseTimerBtn.classList.remove("active");

  // Update the timer display once on page load
  updateTimerDisplay();

  // Handle shuffle mode selection
  const shuffleToggle = document.getElementById("shuffle-toggle");

  shuffleToggle.addEventListener("click", function () {
    // Add animation class
    this.classList.add("animating");

    // Remove animation class after animation completes
    setTimeout(() => {
      this.classList.remove("animating");
    }, 500);

    const currentMode = this.getAttribute("data-mode");

    if (currentMode === "sequential") {
      // Switch to shuffle mode
      this.setAttribute("data-mode", "shuffle");
      this.classList.add("active");

      // Fisher-Yates shuffle algorithm
      for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
      }
      currentCardIndex = 0;
      isFront = true;
      updateCardDisplay();
    } else {
      // Switch back to sequential mode
      this.setAttribute("data-mode", "sequential");
      this.classList.remove("active");

      // Reload original order
      fetch("/api/flashcards")
        .then((response) => response.json())
        .then((data) => {
          flashcards = data;
          currentCardIndex = 0;
          isFront = true;
          updateCardDisplay();
        });
    }
  });

  // Add keyboard shortcuts
  // Variables to track key press duration
  let rKeyPressTime = 0;
  let rKeyHoldTimer = null;
  const RESET_HOLD_DURATION = 800; // Hold for 800ms to reset

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp": // Up arrow to flip card
        flipCard.click();
        break;
      case "ArrowLeft": // Left arrow for previous card
        prevCardButton.click();
        break;
      case "ArrowRight": // Right arrow for next card
        nextCardButton.click();
        break;
      case " ": // Space to toggle timer
        timerRunning ? pauseTimer() : startTimer();
        event.preventDefault(); // Prevent scrolling with spacebar
        break;
      case "r": // 'r' key to reset timer when held down
        if (!rKeyPressTime) {
          rKeyPressTime = Date.now();

          // Start a timer to check if key is being held down
          rKeyHoldTimer = setTimeout(() => {
            resetTimer();
            // Visual feedback that reset occurred
            resetTimerBtn.classList.add("active");
            setTimeout(() => resetTimerBtn.classList.remove("active"), 200);
          }, RESET_HOLD_DURATION);
        }
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "r") {
      // Clear the hold timer when 'r' key is released
      clearTimeout(rKeyHoldTimer);
      rKeyPressTime = 0;
    }
  });

  // Flip the card when clicked
  flipCard.addEventListener("click", () => {
    flipCard.classList.toggle("flipped");
    isFront = !isFront; // Toggle the side being displayed
    updateCardDisplay();
  });

  // Navigate to the previous card
  prevCardButton.addEventListener("click", () => {
    currentCardIndex =
      (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    isFront = true; // Reset to front side
    updateCardDisplay();
  });

  // Navigate to the next card
  nextCardButton.addEventListener("click", () => {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    isFront = true; // Reset to front side
    updateCardDisplay();
  });

  // Initialize the card display
  if (flashcards.length > 0) {
    updateCardDisplay();
  } else {
    cardContent.textContent = "No cards available";
    cardCounter.textContent = "0 of 0";
  }
});
