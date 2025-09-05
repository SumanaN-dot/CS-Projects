document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const userData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      first_name: document.getElementById("first-name").value,
      last_name: document.getElementById("last-name").value,
      promoOptIn: document.getElementById("promotional-emails").checked,
    };

    const shippingAddress = {
      address_line1: document.getElementById("street-address")?.value || "",
      city: document.getElementById("city")?.value || "",
      state: document.getElementById("state")?.value || "",
      zip_code: document.getElementById("zip-code")?.value || "",
    };

    const paymentInfo = {
      card_number: document.getElementById("card-number")?.value || "",
      expiry_date: document.getElementById("expiration-date")?.value || "",
      cvv: document.getElementById("cvv")?.value || "",
      billing_address: document.getElementById("billing-address")?.value || "",
    };

    // Shipping validation: all or nothing
    const hasAnyShipping = shippingAddress.address_line1 || shippingAddress.city || shippingAddress.state || shippingAddress.zip_code;
      if (hasAnyShipping && (!shippingAddress.address_line1 || !shippingAddress.state || !shippingAddress.city || !shippingAddress.zip_code)) {
        throw new Error("All shipping address fields required to save address")
    }

    // Payment validation: all or nothing
    const hasAnyPayment = paymentInfo.card_number || paymentInfo.expiry_date || paymentInfo.cvv || paymentInfo.billing_address;
      if (hasAnyPayment && (!paymentInfo.card_number || !paymentInfo.expiry_date || !paymentInfo.cvv || !paymentInfo.billing_address)) {
        throw new Error("All payment information fields required to save payment")
    }


    try {
      // Basic validation
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.first_name ||
        !userData.last_name
      ) {
        throw new Error("All fields are required");
      }

      // Send the registration data to the backend
      console.log("Sending registration data:", userData); // Debugging line
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         body: JSON.stringify({
          ...userData,
          ...shippingAddress,
          ...paymentInfo,
        }),
      });

      // Handle the response from the backend
      let result;
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        // If the response is not JSON, handle it as text
        const text = await res.text();
        console.error("Unexpected response format:", text);
        throw new Error(text || "Unexpected response format");
      }

      if (res.ok) {
        // Registration successful
        window.location.href ="registration-confirmation.html"; // Redirect to successful registration page
      } else {
        // Registration failed
        console.error("Registration failed:", result);
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the toggle buttons for shipping and payment sections
  const toggleShippingButton = document.getElementById("toggle-shipping");
  const shippingContainer = document.getElementById("shipping-container");

  const togglePaymentButton = document.getElementById("toggle-payment");
  const paymentContainer = document.getElementById("payment-container");

  //
  const streetAddressInput = document.getElementById("street-address");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const zipCodeInput = document.getElementById("zip-code");

  const cardNumberInput = document.getElementById("card-number");
  const expirationDateInput = document.getElementById("expiration-date");
  const cvvInput = document.getElementById("cvv");

  toggleShippingButton.addEventListener("click", function () {
    if (shippingContainer.style.display === "none") {
      shippingContainer.style.display = "block";
      streetAddressInput.required = true;
      cityInput.required = true;
      stateInput.required = true;
      zipCodeInput.required = true;
      toggleShippingButton.textContent = "-Remove Shipping Address";
    } else {
      shippingContainer.style.display = "none";
      streetAddressInput.required = false;
      cityInput.required = false;
      stateInput.required = false;
      zipCodeInput.required = false;
      toggleShippingButton.textContent = "+Add Shipping Address";
    }
  });

  togglePaymentButton.addEventListener("click", function () {
    if (paymentContainer.style.display === "none") {
      paymentContainer.style.display = "block";
      cardNumberInput.required = true;
      expirationDateInput.required = true;
      cvvInput.required = true;
      togglePaymentButton.textContent = "-Remove Payment Information";
    } else {
      paymentContainer.style.display = "none";
      cardNumberInput.required = false;
      expirationDateInput.required = false;
      cvvInput.required = false;
      togglePaymentButton.textContent = "+Add Payment Information";
    }
  });
});
