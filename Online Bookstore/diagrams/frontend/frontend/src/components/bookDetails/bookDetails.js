document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // Get the book id from the URL
  const bookImageContainer = document.getElementById("book-img-container");
  const bookDetailContainer = document.getElementById("book-detail-container");

  if (!id) {
    return; // If no query, do nothing
  }

  fetch(`/api/books/bookDetails?id=${encodeURIComponent(id)}`)
    .then((res) => {
      if (res.status === 404) {
        // If the server returns a 404, we can assume no books were found
        bookImageContainer.innerHTML = "<p>No results found.</p>";
        return []; // Return an empty array to avoid further processing
      }
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((book) => {
      if (!Array.isArray(book) || book.length === 0) {
        bookImageContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      book.forEach((book) => {
        const bookImg = document.createElement("div");
        bookImg.classList.add("book-img");
        bookImg.innerHTML = `<img src="${book.image_url}" alt="${book.title}}">`;

        const isComingSoon = book.is_coming_soon === true;

        const bookDetails = document.createElement("div");
        bookDetails.classList.add("book-details");
        bookDetails.innerHTML = `
                    <h1>${book.title}</h1>
                    <p>by ${book.author}<p>
                    <p id=price>$${Number(book.price).toFixed(2)}</p>
                    <div class="cart-section">
                    ${
                      isComingSoon
                        ? `<p id="comingsoonlabel">This book is coming soon</p>`
                        : ""
                    }
                     <button class="add-to-cart" data-book-id="${book.id}">
                          ${isComingSoon ? "Preorder" : "Add to Cart"}
                      </button>
                    </div>
                    <div class="divider"></div>
                    <h2>Description</h2>
                    <p>${book.intro}</p>
                    `;

        bookImageContainer.appendChild(bookImg);
        bookDetailContainer.appendChild(bookDetails);
      });
    })
    .catch((error) => {
      console.error("Error getting book details", error);
      const bookImageContainer = document.getElementById("book-img-container");
      bookImageContainer.innerHTML =
        "<p>Error loading book details. Please try again later.</p>";
    });
});

document
  .getElementById("cart-icon")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const res = await fetch("api/users/check-auth"); // Check if user is logged in
    const data = await res.json();

    if (res.status === 401) {
      // User is not authenticated, show login modal
      alert("You need to log in to access the cart.");
      document.getElementById("login-modal").style.display = "flex";
      return;
    }

    if (!res.ok) {
      console.error("Error checking authentication:", data);
      alert(
        "There was a problem checking your login status. Please try again."
      );
      return;
    }

    // User is authenticated, proceed to cart page
    if (data.loggedIn) {
      window.location.href = "../shoppingcart/shoppingcart.html";
    }
  });

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("/api/cart/count");
    if (!res.ok) {
      document.getElementById("cart-count").textContent = "0";
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    document.getElementById("cart-count").textContent = data.itemCount || 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
});


// Add event listener for Add to Cart buttons
document.addEventListener("click", async function (e) {
  if (e.target && e.target.classList.contains("add-to-cart")) {
    const bookId = e.target.getAttribute("data-book-id");

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      });

      if (res.status === 401) {
        alert("You need to log in to add items to your cart.");
        document.getElementById("login-modal").style.display = "flex";
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      alert("Book added to cart successfully!");
      updateCartCount();
    } catch (error) {
      console.error("Error adding book to cart:", error);
      alert(
        "There was an error adding the book to your cart. Please try again."
      );
    }
  }
});

async function updateCartCount() {
  try {
    const res = await fetch("/api/cart/count");
    if (!res.ok) {
      document.getElementById("cart-count").textContent = "0";
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    document.getElementById("cart-count").textContent = data.itemCount || 0;
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}


