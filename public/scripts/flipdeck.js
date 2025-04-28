document.addEventListener("DOMContentLoaded", async () => {
  let flashcards = [];
  let currentCardIndex = 0;
  let isFront = true;

  const cardContent = document.getElementById("card-content");
  const cardCounter = document.getElementById("card-counter");
  const flipCard = document.getElementById("flip-card");
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
    cardCounter.textContent = "Card 0 of 0";
    return;
  }

  // Update the card display
  const updateCardDisplay = () => {
    const currentCard = flashcards[currentCardIndex];
    cardContent.textContent = isFront ? currentCard.prompt : currentCard.answer;
    cardCounter.textContent = `Card ${currentCardIndex + 1} of ${
      flashcards.length
    }`;
  };

  // Flip the card when clicked
  flipCard.addEventListener("click", () => {
    isFront = !isFront;
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
    cardCounter.textContent = "Card 0 of 0";
  }
});
