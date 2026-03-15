// index.js - Beautiful Cart with Perfect Alignment

document.addEventListener("DOMContentLoaded", function () {
    // ===== CART STATE =====
    const cartContent = document.getElementById("cart-content");
    const cartBadge = document.querySelector(".badge");
    let cartItems = [];

    // ===== INITIALIZATION =====
    function init() {
        loadCartFromStorage();
        setupEventListeners();
        addCartStyles();
    }

    // ===== CART OPERATIONS =====
    function loadCartFromStorage() {
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
            try {
                cartItems = JSON.parse(savedItems);
                updateCartDisplay();
            } catch (e) {
                console.error('Error loading cart:', e);
                cartItems = [];
                updateCartDisplay();
            }
        } else {
            updateCartDisplay();
        }
    }

    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartBadge();
    }

    function addToCart(name, price, image, quantity = 1) {
        const item = {
            foodName: name,
            foodPrice: parseFloat(price),
            qty: parseInt(quantity),
            image: image
        };

        const existingItem = cartItems.find(i => i.foodName === item.foodName);
        
        if (existingItem) {
            existingItem.qty += item.qty;
            showNotification(`${name} quantity updated!`, 'success');
        } else {
            cartItems.push(item);
            showNotification(`${name} added to cart!`, 'success');
        }
        
        saveCartToStorage();
        updateCartDisplay();
        animateCartIcon();
    }

    function removeFromCart(foodName) {
        cartItems = cartItems.filter(item => item.foodName !== foodName);
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Item removed from cart', 'info');
    }

    function updateQuantity(foodName, change) {
        const itemIndex = cartItems.findIndex(item => item.foodName === foodName);
        if (itemIndex !== -1) {
            const newQty = cartItems[itemIndex].qty + change;
            
            if (newQty < 1) {
                removeFromCart(foodName);
                return;
            }
            
            cartItems[itemIndex].qty = newQty;
            saveCartToStorage();
            updateCartDisplay();
        }
    }

    function clearCart() {
        if (cartItems.length > 0) {
            if (confirm('Are you sure you want to clear your cart?')) {
                cartItems = [];
                saveCartToStorage();
                updateCartDisplay();
                showNotification('Cart cleared', 'info');
            }
        }
    }

    function proceedToCheckout() {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return false;
        }
        saveCartToStorage();
        window.location.href = 'order.html';
        return false;
    }

    // ===== CART DISPLAY =====
    function updateCartDisplay() {
        if (!cartContent) return;

        if (cartItems.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fa fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="foods.html" class="browse-foods-btn">Browse Foods</a>
                </div>
            `;
            updateCartBadge();
            return;
        }

        const total = cartItems.reduce((total, item) => total + (item.foodPrice * item.qty), 0);
        const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

        // Build beautiful cart HTML
        let cartHTML = `
            <div class="cart-header">
                <h3><i class="fa fa-shopping-bag"></i> My Cart (${totalItems})</h3>
                <button class="clear-cart-btn" onclick="window.clearCart()">
                    <i class="fa fa-trash-alt"></i> Clear
                </button>
            </div>
            <div class="cart-items-container">
        `;

        cartItems.forEach((item) => {
            const itemTotal = (item.foodPrice * item.qty).toFixed(2);
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.foodName}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.foodName}</div>
                        <div class="cart-item-price">$${item.foodPrice.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="window.updateQuantity('${item.foodName}', -1)">
                            <i class="fa fa-minus"></i>
                        </button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="window.updateQuantity('${item.foodName}', 1)">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">$${itemTotal}</div>
                    <button class="cart-item-remove" onclick="window.removeFromCart('${item.foodName}')">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            `;
        });

        cartHTML += `
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="total-amount">$${total.toFixed(2)}</span>
                </div>
                <div class="cart-buttons">
                    <button class="btn-checkout" onclick="window.proceedToCheckout()">
                        <i class="fa fa-credit-card"></i> Proceed to Checkout
                    </button>
                    <button class="btn-clear" onclick="window.clearCart()">
                        <i class="fa fa-trash-alt"></i> Clear Cart
                    </button>
                </div>
            </div>
        `;

        cartContent.innerHTML = cartHTML;
        updateCartBadge();
    }

    function updateCartBadge() {
        if (cartBadge) {
            const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
            cartBadge.innerText = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        const shoppingCart = document.getElementById("shopping-cart");
        if (shoppingCart && cartContent) {
            shoppingCart.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                cartContent.classList.toggle("active");
                if (cartContent.classList.contains("active")) {
                    updateCartDisplay();
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (cartContent && !cartContent.contains(e.target) && !shoppingCart?.contains(e.target)) {
                cartContent.classList.remove('active');
            }
        });

        document.querySelectorAll(".food-menu-box form").forEach(form => {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                
                const parent = form.closest(".food-menu-box");
                const foodName = parent.querySelector("h4").innerText;
                const foodPrice = parseFloat(parent.querySelector(".food-price").innerText.replace("$", ""));
                const qtyInput = parent.querySelector("input[type='number']");
                const qty = parseInt(qtyInput.value);
                const foodImage = parent.querySelector(".food-menu-img img").src;

                if (qty < 1) {
                    showNotification("Please select at least 1 item", "error");
                    return;
                }

                addToCart(foodName, foodPrice, foodImage, qty);
                qtyInput.value = 1;
            });
        });

        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchTerm = document.getElementById('search-input').value;
                window.location.href = `foods.html?search=${encodeURIComponent(searchTerm)}`;
            });
        }

        const menuToggle = document.getElementById('menu-toggle');
        const menuList = document.getElementById('menu-list');
        
        if (menuToggle && menuList) {
            menuToggle.addEventListener('click', () => {
                menuList.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                icon.className = menuList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });
        }
    }

    // ===== NOTIFICATION =====
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let icon = 'fa-check-circle';
        let bgColor = '#10b981';
        
        if (type === 'error') {
            icon = 'fa-exclamation-circle';
            bgColor = '#ef4444';
        } else if (type === 'info') {
            icon = 'fa-info-circle';
            bgColor = '#3b82f6';
        }
        
        notification.innerHTML = `
            <i class="fa ${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function animateCartIcon() {
        const cartIcon = document.querySelector('.shopping-cart');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }
window.handleSearch = function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (searchTerm === '') {
        showNotification('Please enter a search term', 'error');
        return false;
    }
    
    // Save to localStorage and redirect
    localStorage.setItem('searchTerm', searchTerm);
    window.location.href = `foods.html?search=${encodeURIComponent(searchTerm)}`;
    return false;
};
    // ===== STYLES =====
    function addCartStyles() {
        if (!document.getElementById('cart-beautiful-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-beautiful-styles';
            style.textContent = `
                /* Cart Container */
                .cart-content {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 420px;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 20px 35px -8px rgba(0,0,0,0.2), 0 10px 15px -6px rgba(0,0,0,0.1);
                    margin-top: 15px;
                    display: none;
                    z-index: 1001;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .cart-content.active {
                    display: block;
                    animation: slideIn 0.25s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Cart Header */
                .cart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 22px;
                    background: #faf9f8;
                    border-bottom: 1px solid #f0f0f0;
                }

                .cart-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .cart-header h3 i {
                    color: #c49b63;
                    font-size: 1.2rem;
                }

                .clear-cart-btn {
                    background: none;
                    border: 1px solid #ff4444;
                    color: #ff4444;
                    padding: 6px 14px;
                    border-radius: 40px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .clear-cart-btn:hover {
                    background: #ff4444;
                    color: white;
                }

                /* Cart Items Container */
                .cart-items-container {
                    max-height: 380px;
                    overflow-y: auto;
                    padding: 5px 15px;
                    background: white;
                }

                .cart-items-container::-webkit-scrollbar {
                    width: 5px;
                }

                .cart-items-container::-webkit-scrollbar-track {
                    background: #f5f5f5;
                }

                .cart-items-container::-webkit-scrollbar-thumb {
                    background: #c49b63;
                    border-radius: 10px;
                }

                /* Cart Item */
                .cart-item {
                    display: flex;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 12px;
                }

                .cart-item:last-child {
                    border-bottom: none;
                }

                .cart-item-image {
                    width: 55px;
                    height: 55px;
                    border-radius: 14px;
                    overflow: hidden;
                    flex-shrink: 0;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.05);
                }

                .cart-item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .cart-item-info {
                    flex: 1;
                    min-width: 0;
                }

                .cart-item-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #1a1a1a;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .cart-item-price {
                    color: #c49b63;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .cart-item-controls {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #f8f8f8;
                    padding: 4px;
                    border-radius: 30px;
                }

                .qty-btn {
                    width: 28px;
                    height: 28px;
                    border: none;
                    background: white;
                    border-radius: 30px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    color: #4a4a4a;
                    font-size: 0.8rem;
                }

                .qty-btn:hover {
                    background: #c49b63;
                    color: white;
                }

                .qty-value {
                    min-width: 25px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #1a1a1a;
                }

                .cart-item-total {
                    font-weight: 700;
                    color: #c49b63;
                    font-size: 1rem;
                    min-width: 65px;
                    text-align: right;
                }

                .cart-item-remove {
                    color: #999;
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 30px;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                }

                .cart-item-remove:hover {
                    background: #ff4444;
                    color: white;
                }

                /* Cart Footer */
                .cart-footer {
                    padding: 18px 22px;
                    background: #faf9f8;
                    border-top: 1px solid #f0f0f0;
                }

                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #1a1a1a;
                }

                .total-amount {
                    color: #c49b63;
                    font-size: 1.2rem;
                }

                .cart-buttons {
                    display: flex;
                    gap: 10px;
                }

                .btn-checkout, .btn-clear {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 40px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-checkout {
                    background: #c49b63;
                    color: white;
                }

                .btn-checkout:hover {
                    background: #a47c44;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -8px #c49b63;
                }

                .btn-clear {
                    background: white;
                    color: #ff4444;
                    border: 1px solid #ff4444;
                }

                .btn-clear:hover {
                    background: #ff4444;
                    color: white;
                }

                /* Empty Cart */
                .empty-cart {
                    text-align: center;
                    padding: 50px 20px;
                }

                .empty-cart i {
                    font-size: 4rem;
                    color: #e0e0e0;
                    margin-bottom: 15px;
                }

                .empty-cart p {
                    color: #999;
                    margin-bottom: 20px;
                    font-size: 1rem;
                }

                .browse-foods-btn {
                    display: inline-block;
                    padding: 12px 28px;
                    background: #c49b63;
                    color: white;
                    text-decoration: none;
                    border-radius: 40px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                }

                .browse-foods-btn:hover {
                    background: #a47c44;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -8px #c49b63;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .cart-content {
                        width: 380px;
                        right: -70px;
                    }
                }

                @media (max-width: 480px) {
                    .cart-content {
                        width: 340px;
                        right: -85px;
                    }
                    
                    .cart-item {
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    
                    .cart-item-info {
                        width: calc(100% - 65px);
                    }
                    
                    .cart-item-controls {
                        margin-left: 65px;
                    }
                    
                    .cart-buttons {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Make functions globally available
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.clearCart = clearCart;
    window.proceedToCheckout = proceedToCheckout;

    // Initialize
    init();
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);