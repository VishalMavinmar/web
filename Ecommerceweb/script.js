// script.js - Cart functionality for foods.html

// Cart functions
function addToCart(name, price, image) {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Create item object with consistent property names
    const item = {
        foodName: name,
        foodPrice: price,
        qty: 1,
        image: image
    };
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(i => i.foodName === name);
    
    if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        cart[existingItemIndex].qty += 1;
        showNotification(`${name} quantity updated in cart!`, 'success');
    } else {
        // New item, add to cart
        cart.push(item);
        showNotification(`${name} added to cart!`, 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Update cart badge if it exists
    updateCartBadge();
    
    // Animate cart icon
    animateCartIcon();
}

// Update cart badge count
function updateCartBadge() {
    const badge = document.querySelector('.badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalItems = cart.reduce((total, item) => total + (item.qty || 1), 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Animate cart icon
function animateCartIcon() {
    const cartIcon = document.querySelector('.shopping-cart i');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification`;
    notification.innerHTML = `
        <i class="fa ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge
    updateCartBadge();
    
    // Cart toggle functionality
    const shoppingCart = document.getElementById("shopping-cart");
    const cartContent = document.getElementById("cart-content");
    
    if (shoppingCart && cartContent) {
        shoppingCart.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            cartContent.classList.toggle("active");
            
            // Load cart items when opening
            if (cartContent.classList.contains("active")) {
                displayCartItems();
            }
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartContent && !cartContent.contains(e.target) && !shoppingCart?.contains(e.target)) {
            cartContent.classList.remove('active');
        }
    });
});

// Display cart items in the dropdown
function displayCartItems() {
    const cartContent = document.getElementById('cart-content');
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fa fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let itemsHTML = '<div class="cart-items-list">';
    
    cart.forEach((item, index) => {
        const itemTotal = (item.foodPrice * item.qty).toFixed(2);
        total += item.foodPrice * item.qty;
        
        itemsHTML += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.foodName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.foodName}</div>
                    <div class="cart-item-price">$${item.foodPrice.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn minus" onclick="updateQuantity('${item.foodName}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus" onclick="updateQuantity('${item.foodName}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-total">$${itemTotal}</div>
                <button class="remove-item" onclick="removeFromCart('${item.foodName}')">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    itemsHTML += '</div>';
    
    cartContent.innerHTML = `
        ${itemsHTML}
        <div class="cart-summary">
            <div class="cart-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <a href="order.html" class="btn-checkout">Proceed to Checkout</a>
                <button class="btn-clear" onclick="clearCart()">Clear Cart</button>
            </div>
        </div>
    `;
}

// Update quantity
function updateQuantity(name, change) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cart.findIndex(i => i.foodName === name);
    
    if (itemIndex !== -1) {
        cart[itemIndex].qty += change;
        
        if (cart[itemIndex].qty < 1) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateCartBadge();
        displayCartItems();
    }
}

// Remove from cart
function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart = cart.filter(i => i.foodName !== name);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartBadge();
    displayCartItems();
    showNotification('Item removed from cart', 'info');
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cartItems');
        updateCartBadge();
        displayCartItems();
        showNotification('Cart cleared', 'info');
    }
}