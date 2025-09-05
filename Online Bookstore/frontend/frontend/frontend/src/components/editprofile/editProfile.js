document.getElementById("editProfileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const profileData = {};
  formData.forEach((value, key) => {
    profileData[key] = value;
  });

  profileData.promoOptIn = document.querySelector('input[name="promoOptIn"]').checked;
  console.log("Sending promoOptIn:", profileData.promoOptIn);

  fetch("/api/users/editProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(profileData)
  })
    .then(response => response.json())
    .then(data => {
      alert("Profile updated!");
    })
    .catch(error => {
      console.error("Error updating profile:", error);
    });
});

// Function to load current profile data
async function loadProfileData() {
  try {
    const response = await fetch("/api/users/editProfile");
    
    if (response.ok) {
      const profile = await response.json();
      
      // Populate form fields
      document.querySelector('input[name="firstName"]').value = profile.firstName || '';
      document.querySelector('input[name="lastName"]').value = profile.lastName || '';
      document.querySelector('input[name="email"]').value = profile.email || '';
      document.querySelector('input[name="password"]').value = profile.password || '';
      document.querySelector('input[name="street"]').value = profile.street || '';
      document.querySelector('input[name="city"]').value = profile.city || '';
      document.querySelector('input[name="state"]').value = profile.state || '';
      document.querySelector('input[name="zip"]').value = profile.zip || '';
      document.querySelector('input[name="card"]').value = profile.card || '';
      document.querySelector('input[name="exp"]').value = profile.exp || '';
      document.querySelector('input[name="cvv"]').value = profile.cvv || '';
      document.querySelector('input[name="promoOptIn"]').checked = profile.promoOptIn || false;
      
    } else {
      console.error("Failed to load profile data");
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  try {
    const res = await fetch("/api/users/check-auth");
    const data = await res.json();

    if (data.loggedIn) {
      document.getElementById("user-greeting").textContent = `My Account`;
      // Load profile data after confirming user is logged in
      await loadProfileData();
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
});




let savedCards = [
  
];


function renderSavedCards() {
  const savedCardsDiv = document.getElementById("savedCards");
  savedCardsDiv.innerHTML = "";
  savedCards.forEach((card, idx) => {
    savedCardsDiv.innerHTML += `
      <div style="margin-bottom:8px;">
        Card ending in <b>**** ${card.last4}</b>, Exp: ${card.exp}
        ${card.isDefault ? '<span style="color: green; font-weight: bold; margin-left: 10px;">[Default]</span>' : `
          <button type="button" onclick="setDefaultCard(${idx})" style="margin-left:10px;color:white;background:#007bff;border:none;padding:2px 8px;cursor:pointer;">
            Set as Default
          </button>
        `}
        <button type="button" onclick="removeCard(${idx})" style="margin-left:10px;color:white;background:red;border:none;padding:2px 8px;cursor:pointer;">
          Delete
        </button>
      </div>
    `;
  });
  document.getElementById("addCardBtn").style.display = savedCards.length >= 4 ? "none" : "inline-block";
}




window.removeCard = function(idx) {
  savedCards.splice(idx, 1);
  renderSavedCards();
};

window.setDefaultCard = function(idx) {
  
  savedCards.forEach((c, i) => c.isDefault = (i === idx));
  renderSavedCards();
  
};


document.getElementById("addCardBtn").onclick = function() {
  document.getElementById("addCardForm").style.display = "block";
};


document.getElementById("cancelAddCardBtn").onclick = function() {
  document.getElementById("addCardForm").style.display = "none";
};


document.getElementById("saveCardBtn").onclick = function() {
  const num = document.querySelector('input[name="newCardNumber"]').value;
  const exp = document.querySelector('input[name="newExp"]').value;
  const cvv = document.querySelector('input[name="newCvv"]').value;
  if (num && exp && cvv && savedCards.length < 4) {
    savedCards.push({ last4: num.slice(-4), exp: exp });
    renderSavedCards();
    document.getElementById("addCardForm").style.display = "none";
    
    document.querySelector('input[name="newCardNumber"]').value = "";
    document.querySelector('input[name="newExp"]').value = "";
    document.querySelector('input[name="newCvv"]').value = "";
    // TODO: In real app, POST this to backend!
  }
};


renderSavedCards();
