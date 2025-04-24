// filepath: /home/jsierra/projects/flipdeck-98/public/scripts/flipdeck.js
document.addEventListener("DOMContentLoaded", async () => {
  let flashcards = [];
  let currentCardIndex = 0;
  let isFront = true;

  const cardContent = document.getElementById("card-content");
  const cardCounter = document.getElementById("card-counter");
  const flipCardButton = document.getElementById("flip-card-button");
  const prevCardButton = document.getElementById("prev-card");
  const nextCardButton = document.getElementById("next-card");
  const deckList = document.getElementById("deck-list");

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

  // Flip the card
  flipCardButton.addEventListener("click", () => {
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

  // Handle card deletion
  deckList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-card-button")) {
      const cardId = event.target.dataset.id;
      const confirmed = confirm("Are you sure you want to delete this card?");
      if (confirmed) {
        try {
          const response = await fetch(`/flashcards/${cardId}/delete`, {
            method: "POST",
          });
          if (response.ok) {
            event.target.closest(".card").remove();
            alert("Card deleted successfully.");
          } else {
            alert("Failed to delete the card.");
          }
        } catch (error) {
          console.error("Error deleting card:", error);
          alert("An error occurred while deleting the card.");
        }
      }
    }
  });

  // Initialize the card display
  if (flashcards.length > 0) {
    updateCardDisplay();
  } else {
    cardContent.textContent = "No cards available";
    cardCounter.textContent = "Card 0 of 0";
  }
});
