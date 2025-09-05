// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Handle logout links
  const logoutItems = document.querySelectorAll("li.logout");
  if (logoutItems.length) {
    logoutItems.forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("/api/users/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (res.ok) {
            window.location.replace("/");
          } else {
            alert("Failed to logout.");
          }
        } catch (err) {
          console.error(err);
          alert("Error logging out.");
        }
      });
    });
  }

  function setupDropdown(toggleId, menuId) {
    const toggleEl = document.getElementById(toggleId);
    const menuEl = document.getElementById(menuId);
    if (!toggleEl || !menuEl) return;
    // Toggle visibility
    toggleEl.addEventListener("click", () => {
      menuEl.style.display = "none";
    });
    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!toggleEl.contains(e.target) && !menuEl.contains(e.target)) {
        menuEl.style.display = "none";
      }
    });
  }

  // Apply to both user and admin dropdowns
  setupDropdown("open-login", "user-dropdown");
  setupDropdown("open-login", "admin-dropdown");

  document
    .getElementById("open-login")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/users/check-auth");
        const data = await res.json();
  
        if (data.loggedIn) {
          if (data.admin) {
            document
              .getElementById("admin-dropdown").style.display = "flex";
          } else {
            document.getElementById("user-dropdown").style.display = "flex";
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        alert("Could not verify login status.");
      }
    });
});
