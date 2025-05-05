document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("flashcardForm");
  const promptInput = document.getElementById("prompt");
  const answerInput = document.getElementById("answer");
  const promptCharCount = document.getElementById("promptCharCount");
  const answerCharCount = document.getElementById("answerCharCount");

  // Update character count display
  function updatePromptCharCount() {
    if (promptCharCount) {
      const currentLength = promptInput.value.length;
      promptCharCount.textContent = `${currentLength}/500 characters`;

      // Change color if approaching limit
      if (currentLength > 450) {
        promptCharCount.style.color = "#dc3545";
      } else {
        promptCharCount.style.color = "";
      }
    }
  }

  function updateAnswerCharCount() {
    if (answerCharCount) {
      const currentLength = answerInput.value.length;
      answerCharCount.textContent = `${currentLength}/500 characters`;

      // Change color if approaching limit
      if (currentLength > 450) {
        answerCharCount.style.color = "#dc3545";
      } else {
        answerCharCount.style.color = "";
      }
    }
  }

  // Initialize character counts
  if (promptInput && promptCharCount) {
    updatePromptCharCount();
    promptInput.addEventListener("input", updatePromptCharCount);
  }

  if (answerInput && answerCharCount) {
    updateAnswerCharCount();
    answerInput.addEventListener("input", updateAnswerCharCount);
  }

  // Client-side validation
  if (form) {
    form.addEventListener("submit", function (event) {
      let isValid = true;

      // Validate prompt
      if (promptInput.value.trim().length < 3) {
        event.preventDefault();
        isValid = false;

        // Add error class
        promptInput.parentElement.classList.add("error");

        // Check if error message already exists
        let errorMsg =
          promptInput.parentElement.querySelector(".error-message");
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          promptInput.parentElement.insertBefore(
            errorMsg,
            promptInput.nextSibling
          );
        }
        errorMsg.textContent = "Prompt must be at least 3 characters.";
      } else if (promptInput.value.trim().length > 500) {
        event.preventDefault();
        isValid = false;

        // Add error class
        promptInput.parentElement.classList.add("error");

        // Check if error message already exists
        let errorMsg =
          promptInput.parentElement.querySelector(".error-message");
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          promptInput.parentElement.insertBefore(
            errorMsg,
            promptInput.nextSibling
          );
        }
        errorMsg.textContent = "Prompt cannot exceed 500 characters.";
      } else {
        // Remove error styling if valid
        promptInput.parentElement.classList.remove("error");
        const errorMsg =
          promptInput.parentElement.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      }

      // Validate answer
      if (answerInput.value.trim().length < 1) {
        event.preventDefault();
        isValid = false;

        // Add error class
        answerInput.parentElement.classList.add("error");

        // Check if error message already exists
        let errorMsg =
          answerInput.parentElement.querySelector(".error-message");
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          answerInput.parentElement.insertBefore(
            errorMsg,
            answerInput.nextSibling
          );
        }
        errorMsg.textContent = "Answer must be at least 1 character.";
      } else if (answerInput.value.trim().length > 500) {
        event.preventDefault();
        isValid = false;

        // Add error class
        answerInput.parentElement.classList.add("error");

        // Check if error message already exists
        let errorMsg =
          answerInput.parentElement.querySelector(".error-message");
        if (!errorMsg) {
          errorMsg = document.createElement("span");
          errorMsg.className = "error-message";
          answerInput.parentElement.insertBefore(
            errorMsg,
            answerInput.nextSibling
          );
        }
        errorMsg.textContent = "Answer cannot exceed 500 characters.";
      } else {
        // Remove error styling if valid
        answerInput.parentElement.classList.remove("error");
        const errorMsg =
          answerInput.parentElement.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      }

      return isValid;
    });
  }
});
