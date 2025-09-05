document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("/api/users/check-auth");
    const data = await res.json();

    if (data.loggedIn) {
      document.getElementById("user-greeting").textContent = `My Account`;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const cartItemsContainer = document.getElementById("cartItems");

  fetch("/api/cart/cartItems")
    .then((response) => response.json())
    .then((cartItems) => {
      cartItemsContainer.innerHTML = ""; 
      const checkoutButton = document.getElementById("checkout-button");
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        checkoutButton.disabled = true;
        document.getElementById("itemCount").textContent = 0;
        document.getElementById("subtotal").textContent = "0.00";
        return;
      }

      checkoutButton.disabled = false;
      let subtotal = 0;
      cartItems.forEach((item) => {
        subtotal += item.price * item.quantity;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          <img src="${item.image_url}" alt="${item.title}" />
          <div class="item-details">
          <h3>${item.title}</h3>
          <p>Price: $${item.price}</p>
          </div>
          <div class="item-quantity">
            <button class="quantity-decrease" data-book-id="${item.book_id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-increase" data-book-id="${item.book_id}">+</button>
          </div>
          <button class="remove-from-cart" data-book-id="${
            item.book_id
          }">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
      });
      updateCartCount();
    })
    .catch((error) => {
      console.error("Error fetching cart items:", error);
      cartItemsContainer.innerHTML =
        "<p>Error loading cart items. Please try again later.</p>";
    });
});

document.getElementById("checkout-button").addEventListener("click", function () {
  window.location.href = "../checkout/checkout.html"; 
});


document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("quantity-increase")) {
    const bookId = event.target.getAttribute("data-book-id");
    try {
      const res = await fetch('/api/cart/increaseQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.newQuantity !== undefined) {
        const quantityElement = event.target.previousElementSibling;
        quantityElement.textContent = data.newQuantity;
        updateCartCount();
      } 
    } catch (error) {
      console.error("Error increasing quantity:", error);
      alert("There was a problem updating the quantity. Please try again.");
    }
  }
});

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("quantity-decrease")) {
    const bookId = event.target.getAttribute("data-book-id");
    try {
      const res = await fetch('/api/cart/decreaseQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.newQuantity !== undefined) {
        const quantityElement = event.target.nextElementSibling;
        if (data.newQuantity <= 0) {
          removeCartItem(bookId);
        } else {
          quantityElement.textContent = data.newQuantity;
          updateCartCount();
        }
      } 
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      alert("There was a problem updating the quantity. Please try again.");
    }
  }
});

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("remove-from-cart")) {
    const bookId = event.target.getAttribute("data-book-id");
    try {
      const res = await fetch('/api/cart/removeItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.message === "Item removed successfully") {
        removeCartItem(bookId);
      } 
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("There was a problem removing the item. Please try again.");
    }
  }
});

function removeCartItem(bookId) {
  const itemElement = document.querySelector(
    `.remove-from-cart[data-book-id="${bookId}"]`
  ).closest(".cart-item");
  if (itemElement) {
    itemElement.remove();
  }
  updateCartCount();
}

function updateCartCount() {
  const cartItems = document.querySelectorAll(".cart-item");
  const itemCount = document.getElementById("itemCount");
  const subtotalElement = document.getElementById("subtotal");
  const cartCount = document.getElementById("cart-count");
  let totalItems = 0;
  let subtotal = 0;

  cartItems.forEach((item) => {
    const quantity = parseInt(item.querySelector(".quantity").textContent);
    const price = parseFloat(
      item.querySelector(".item-details p").textContent.replace("Price: $", "")
    );
    totalItems += quantity;
    subtotal += quantity * price;
  });

  itemCount.textContent = totalItems;
  subtotalElement.textContent = subtotal.toFixed(2);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton.disabled = totalItems === 0;
}

document.getElementById("keepShopping-button").addEventListener("click", function () {
  window.location.href = "../searchpage/searchpage.html";
});
