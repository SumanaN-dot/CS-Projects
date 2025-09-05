document.addEventListener("DOMContentLoaded", function () {
  const featuredBooksContainer = document.getElementById(
    "featured-books-container"
  );

  fetch("/api/books/featured")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((books) => {
      if (!Array.isArray(books) || books.length === 0) {
        featuredBooksContainer.innerHTML =
          "<p>No featured books available.</p>";
        return;
      }

      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.innerHTML = `
                <a href="src/components/bookDetails/bookDetails.html?id=${book.id}" class="book-link">
                    <img src="${book.image_url}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>$${Number(book.price).toFixed(2)}</p>
                </a>
                    <button class="add-to-cart" data-book-id="${
                      book.id
                    }">Add to Cart</button>
                    `;
        featuredBooksContainer.appendChild(bookElement);
      });
      initCarousel("featured-books-container", 5);
    })
    .catch((error) => {
      console.error("Error fetching featured books:", error);
      const featuredBooksContainer = document.getElementById("featured-books");
      featuredBooksContainer.innerHTML =
        "<p>Error loading featured books. Please try again later.</p>";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const newReleasesBooksContainer = document.getElementById(
    "new-releases-container"
  );

  fetch("/api/books/newReleases")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((books) => {
      if (!Array.isArray(books) || books.length === 0) {
        featuredBooksContainer.innerHTML =
          "<p>No new release books available.</p>";
        return;
      }

      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.innerHTML = `
                <a href="src/components/bookDetails/bookDetails.html?id=${book.id}" class="book-link">
                    <img src="${book.image_url}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>$${Number(book.price).toFixed(2)}</p>
                </a>
                    <button class="add-to-cart" data-book-id="${
                      book.id
                    }">Add to Cart</button>
                    `;
        newReleasesBooksContainer.appendChild(bookElement);
      });
      initCarousel("new-releases-container", 5);
    })
    .catch((error) => {
      console.error("Error fetching new release books:", error);
      const newReleasesBooksContainer =
        document.getElementById("featured-books");
      newReleasesBooksContainer.innerHTML =
        "<p>Error loading new release books. Please try again later.</p>";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const comingSoonContainer = document.getElementById("coming-soon-container");

  fetch("/api/books/comingSoon")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((books) => {
      if (!Array.isArray(books) || books.length === 0) {
        comingSoonContainer.innerHTML =
          "<p>No coming soon books available.</p>";
        return;
      }

      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.innerHTML = `
                <a href="src/components/bookDetails/bookDetails.html?id=${book.id}" class="book-link">
                    <img src="${book.image_url}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>$${Number(book.price).toFixed(2)}</p>
                </a>
                    <button class="add-to-cart" data-book-id="${
                      book.id
                    }">Add to Cart</button>
                    `;
        comingSoonContainer.appendChild(bookElement);
      });
      initCarousel("coming-soon-container", 5);
    })
    .catch((error) => {
      console.error("Error fetching coming soon books:", error);
      const comingSoonContainer = document.getElementById("coming-soon");
      comingSoonContainer.innerHTML =
        "<p>Error loading coming soon books. Please try again later.</p>";
    });
});

window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const registrationSuccess = params.get("showLogin");

  if (registrationSuccess === "true") {
    // Show the login modal if registration was successful
    document.getElementById("login-modal").style.display = "flex";
  }
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

function initCarousel(trackId, visibleCount) {
  const track = document.getElementById(trackId);
  const prev = track.parentElement.querySelector(".carousel-prev");
  const next = track.parentElement.querySelector(".carousel-next");
  const items = track.querySelectorAll(".book-item");
  if (!items.length) return;

  if (items.length <= visibleCount) {
    prev.style.display = "none";
    next.style.display = "none";
  }

  const totalWidth = track.scrollWidth;
  const itemWidth = totalWidth / items.length;
  const pageCount = Math.ceil(items.length / visibleCount);

  let currentPage = 0;

  function slideTo(page) {
    const offset = page * visibleCount * itemWidth;
    track.style.transform = `translateX(-${offset}px)`;
  }

  prev.addEventListener("click", () => {
    currentPage = (currentPage - 1 + pageCount) % pageCount;
    slideTo(currentPage);
  });

  next.addEventListener("click", () => {
    currentPage = (currentPage + 1) % pageCount;
    slideTo(currentPage);
  });
}

