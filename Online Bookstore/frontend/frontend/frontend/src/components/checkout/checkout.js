let total = 0;
let discount = 0;

fetch("/api/cart/cartItems")
  .then((response) => response.json())
  .then((cart) => {
    const summary = document.getElementById("orderSummary");
    const finalTotalEl = document.getElementById("finalTotal");

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemEl = document.createElement("div");
      itemEl.classList.add("book-summary");
      itemEl.innerHTML = `
        <img src="${item.image_url}" alt="${item.title}">
        <div class="info">
          <p><strong>${item.title}</strong></p>
          <p>$${itemTotal.toFixed(2)}</p>
        </div>
      `;
      summary.appendChild(itemEl);
    });

    const divider = document.createElement("hr");
    summary.parentNode.insertBefore(divider, finalTotalEl);

    finalTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  });

document.getElementById("applyPromo").addEventListener("click", () => {
  const code = document.getElementById("promoCode").value.trim().toLowerCase();
  const message = document.getElementById("promoMessage");
  const finalTotalEl = document.getElementById("finalTotal");

  if (code === "readmore10") {
    discount = 0.1 * total;
    finalTotalEl.textContent = `Total after discount: $${(
      total - discount
    ).toFixed(2)}`;
    message.textContent = "Promo code applied! 10% discount.";
    message.style.color = "green";
  } else {
    discount = 0;
    message.textContent = "Invalid promo code.";
    message.style.color = "red";
    finalTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  }
});

const steps = [
  "shippingSection",
  "paymentSection",
  "summarySection",
  "confirmationSection",
];
const progressSteps = document.querySelectorAll(".step");
let currentStep = 0;

function showStep(index) {
  const slider = document.querySelector(".slider");
  slider.style.transform = `translateX(-${index * 100}%)`;

  progressSteps.forEach((step, i) => {
    step.classList.toggle("active", i <= index);
  });

  const toCartBtn = document.getElementById("to-cart");
  const prevBtn = document.getElementById("prevStep");
  const nextBtn = document.getElementById("nextStep");

  if (index === steps.length - 1) {
    // On confirmation page
    toCartBtn.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    toCartBtn.style.display = index === 0 ? "inline-block" : "none";
    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.style.display = "inline-block";
    nextBtn.textContent =
      index === steps.length - 2 ? "Place Order" : "Continue";
  }
}

document.getElementById("nextStep").addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
});

document.getElementById("prevStep").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

showStep(currentStep);

// Handle checkout form submission
document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const orderData = {};
    formData.forEach((value, key) => {
      orderData[key] = value;
    });

    fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        currentStep = steps.length;
        showStep(currentStep);
        document.querySelectorAll(".step").forEach((step, i) => {
          step.classList.add("active");
        });

        const confirmDetails = document.getElementById("confirmation-details");
        confirmDetails.innerHTML = `
            <p><strong>Order ID:</strong> ${data.orderId || "N/A"}</p>
            <p><strong>Total Paid:</strong> $${(total - discount).toFixed(
              2
            )}</p>
            `;
      })

      .catch((error) => {
        console.error("Checkout failed:", error);
        alert("There was a problem processing your order.");
      });
  });

document.getElementById("to-cart").addEventListener("click", function (e) {
  window.location.href = "../shoppingcart/shoppingcart.html";
});


document.addEventListener("DOMContentLoaded", async function() {
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
