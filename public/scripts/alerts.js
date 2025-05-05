document.addEventListener("DOMContentLoaded", function () {
  // Select all alert elements
  const alerts = document.querySelectorAll(".alert");

  // Modal elements
  const modal = document.getElementById("delete-confirm-modal");
  const cancelBtn = document.getElementById("cancel-delete");
  const confirmBtn = document.getElementById("confirm-delete");
  let currentDeleteForm = null;

  // Add click event listeners to all close buttons
  document.querySelectorAll(".close-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      // Find the parent alert and hide it
      const alert = this.closest(".alert");
      hideAlert(alert);
    });
  });

  // Add confirmation dialog to delete forms
  document.querySelectorAll(".delete-form").forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      currentDeleteForm = this;
      modal.classList.add("show");
    });
  });

  // Modal cancel button
  cancelBtn.addEventListener("click", function () {
    modal.classList.remove("show");
    currentDeleteForm = null;
  });

  // Modal confirm button
  confirmBtn.addEventListener("click", function () {
    if (currentDeleteForm) {
      currentDeleteForm.submit();
    }
    modal.classList.remove("show");
  });

  // Click outside modal to close
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      currentDeleteForm = null;
    }
  });

  // Function to hide an alert with animation
  function hideAlert(alert) {
    alert.style.opacity = "0";
    alert.style.transform = "translateY(-10px)";

    setTimeout(() => {
      alert.style.display = "none";

      // Clean up the URL if it has alert parameters
      const url = new URL(window.location);
      if (url.searchParams.has("alert")) {
        url.searchParams.delete("alert");
        window.history.replaceState({}, "", url);
      }
    }, 300);
  }

  // Auto-dismiss alerts after 5 seconds
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach((alert) => {
        hideAlert(alert);
      });
    }, 5000);
  }
});
