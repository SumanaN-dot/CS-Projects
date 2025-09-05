// Admin Books Management JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    checkAdminAccess();
    
    // Setup form submissions
    setupFormHandlers();
});

// Check admin access
function checkAdminAccess() {
    fetch('/api/users/check-auth')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn || !data.admin) {
                window.location.href = '../loginpage/loginpage.html';
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            window.location.href = '../loginpage/loginpage.html';
        });
}

// Setup form handlers
function setupFormHandlers() {
    // Add book form
    document.getElementById('add-book-form').addEventListener('submit', handleAddBook);
}

// Handle add book form submission
async function handleAddBook(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookData = {
    title: formData.get('title')?.trim(),
    author: formData.get('author')?.trim(),
    genre: formData.get('genre')?.trim(),
    price: parseFloat(formData.get('price')),
    image_url: formData.get('image_url')?.trim(),
    release_date: formData.get('release_date'),
    is_featured: formData.has('is_featured'),
    is_coming_soon: formData.has('is_coming_soon'),
    inventory: parseInt(formData.get('inventory'))
};

if (
    !bookData.title ||
    !bookData.author ||
    !bookData.genre ||
    isNaN(bookData.price) ||
    !bookData.image_url ||
    !bookData.release_date ||
    isNaN(bookData.inventory) ||
    bookData.inventory < 1
) {
    showMessage('Please fill in all required fields.', 'error');
    return;
}
    
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showMessage('Book added successfully!', 'success');
            event.target.reset();
        } else {
            const error = await response.json();
            showMessage(error.message || 'Failed to add book', 'error');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Show message
function showMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageContainer.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageContainer.classList.add('hidden');
    }, 5000);
}
