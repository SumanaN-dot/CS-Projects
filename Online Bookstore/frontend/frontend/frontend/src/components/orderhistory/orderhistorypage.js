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

document.addEventListener("DOMContentLoaded", () => {
  loadOrders(); // initial fetch

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadOrders(tab.dataset.tab);
    });
  });
});

async function loadOrders(filter = "all") {
  try {
    const res = await fetch("/api/users/order"); // Adjust this route if needed
    const orders = await res.json();

    const container = document.getElementById("order-history-container");
    container.innerHTML = "";

    orders.forEach(order => {
      const shouldShow = filter === "all" || order.items.some(item => {
        if (filter === "completed") return item.status === "Delivered";
        if (filter === "cancelled") return item.status === "Cancelled";
      });
      if (!shouldShow) return;

      const orderDiv = document.createElement("div");
      orderDiv.className = "order";

      orderDiv.innerHTML = `
        <div class="order-header">
          <p><strong>Order:</strong> #${order.id}</p>
          <p><strong>Order Payment:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.image_url}" alt="Product" />
            <div class="item-info">
              <h3>${item.title}</h3>
              <p>By: ${item.author || 'Unknown Author'}</p>
              Qty: ${item.quantity}</p>
              <p class="price">Price $${item.price}</p>
            </div>
            <div class="item-status">
              <p>Expected Delivery by: July 31, 2025 </strong></p>
            </div>
          </div>
        `).join("")}
        <div class="order-footer">
          <p class="payment-status">Payment Status: ${order.payment_status}</p>
          <p>Total Price: $${order.total_after_tax}</p>
        </div>
      `;

      container.appendChild(orderDiv);
    });
  } catch (error) {
    console.error("Failed to load orders:", error);
  }
}
