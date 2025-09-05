document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query"); // Get the search query from the URL
  const searchResultsContainer = document.getElementById(
    "search-results-container"
  );

  if (!query) {
    return; // If no query, do nothing
  }

  fetch(`/api/books/search?query=${encodeURIComponent(query)}`)
    .then((res) =>
      // Check if the response is OK (status code 200-299)
      {
        if (res.status === 404) {
          // If the server returns a 404, we can assume no books were found
          searchResultsContainer.innerHTML = "<p>No results found.</p>";
          return []; // Return an empty array to avoid further processing
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      }
    )
    .then((books) => {
      if (!Array.isArray(books) || books.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.innerHTML = `
                    <a href="../bookDetails/bookDetails.html?id=${book.id}" class="book-link">
                        <img src="${book.image_url}" alt="${book.title}">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        <p>$${Number(book.price).toFixed(2)}</p>
                    </a>
                        <button class="add-to-cart" data-book-id="${
                          book.id
                        }">Add to Cart</button>
                `;
        searchResultsContainer.appendChild(bookElement);
      });
    })
    .catch((error) => {
      console.error("Error during search:", error);
      const searchResultsContainer = document.getElementById(
        "search-results-container"
      );
      searchResultsContainer.innerHTML =
        "<p>Error loading search results. Please try again later.</p>";
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
      window.location.href = "src/components/shoppingcart/shoppingcart.html";
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
      updateCartCount()
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

