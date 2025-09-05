// Load promotions when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  loadPromotions();

  const form = document.getElementById('promo-form');
  
  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('promo-name').value.trim();
  const code = document.getElementById('promo-code').value.trim();
  const discount = document.getElementById('discount').value;
  const expiration = document.getElementById('expiration').value;

  try {
    const res = await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, discount, expiration })
    });

    if (!res.ok) throw new Error('Failed to add promotion');

    alert('Promotion added successfully!');
    form.reset();
    loadPromotions();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
});

async function loadPromotions() {
  try {
    const res = await fetch('/api/admin/promotions');
    if (!res.ok) throw new Error('Failed to load promotions');

    const promos = await res.json();
    renderPromotions(promos);
  } catch (err) {
    console.error(err);
    alert('Error loading promotions.');
  }
}

function renderPromotions(promotions) {
  const list = document.getElementById('promo-list');
  list.innerHTML = '';

  promotions.forEach((promo) => {
    const expDate = new Date(promo.expirationdate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const li = document.createElement('li');
    li.textContent = `${promo.name} (Code: ${promo.code}) - ${promo.discountpercentage}% off until ${expDate}`;
    list.appendChild(li);
  });
}