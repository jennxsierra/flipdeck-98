document.addEventListener("DOMContentLoaded", function () {
  // Select all alert elements
  const alerts = document.querySelectorAll(".alert");

  // Add click event listeners to all close buttons
  document.querySelectorAll(".close-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      // Find the parent alert and hide it
      const alert = this.closest(".alert");
      hideAlert(alert);
    });
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
