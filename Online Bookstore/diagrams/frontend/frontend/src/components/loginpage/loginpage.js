document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const username_or_email =
      document.getElementById("username_or_email").value;
    const password = document.getElementById("password").value;

    try {
      // Basic validation
      if (!username_or_email || !password) {
        throw new Error("Username and password are required");
      }

      // Send the login data to the backend
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username_or_email, password }),
      });

      // Handle the response from the backend
      if (res.ok) {
        const result = await res.json();

        if (result.isAdmin) {
          alert("Login successful");
          window.location.href = "src/components/admin/admin.html";
          document.getElementById("user-greeting").textContent = `My Account`;
        } else {
          alert("Login successful!");
          window.location.reload(); 
          document.getElementById("user-greeting").textContent = `My Account`;
        }
      } else {
        const result = await res.json();
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    }
  });


document
  .getElementById("open-login")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/check-auth");
  
      if (res.status === 401) {
        // Show login modal
        document.getElementById("login-modal").style.display = "flex";
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      alert(
        "There was a problem checking your login status. Please try again."
      );
    }
  });

document.getElementById("close").addEventListener("click", function () {
  // Close the login modal
  document.getElementById("login-modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("/api/users/check-auth");
    const data = await res.json();

    // User is authenticated, update UI accordingly
    if (data.loggedIn) {
      document.getElementById("user-greeting").textContent = "My Account";
      document.getElementById(
        "header-message"
      ).textContent = `Welcome ${data.username}!`;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
});
