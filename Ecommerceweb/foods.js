// foods.js - Complete foods page functionality

document.addEventListener("DOMContentLoaded", function () {
    // ===== FOOD ITEMS DATABASE =====
    const foodItems = [
        { name: 'Pizza', price: 8.00, image: 'pizza(1).jpg', desc: 'Delicious cheese pizza with fresh toppings' },
        { name: 'Burger', price: 6.00, image: 'burger.jpg', desc: 'Juicy beef patty with fresh lettuce and tomatoes' },
        { name: 'Sandwich', price: 5.00, image: 'sandwich.jpg', desc: 'Fresh bread with grilled vegetables and cheese' },
        { name: 'Shawarma', price: 8.00, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500', desc: 'Delicious shawarma with special sauce' },
        { name: 'Fried Chicken', price: 9.00, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500', desc: 'Crispy fried chicken pieces' },
        { name: 'French Fries', price: 3.50, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=500', desc: 'Crispy golden french fries' },
        { name: 'Pasta', price: 7.00, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500', desc: 'Creamy pasta with mushrooms' },
        { name: 'Noodles', price: 6.50, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500', desc: 'Stir-fried noodles with vegetables' },
        { name: 'Tacos', price: 7.00, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500', desc: 'Delicious tacos with fresh salsa' },
        { name: 'Hot Dog', price: 4.00, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=500', desc: 'Classic hot dog with toppings' },
        { name: 'Salad', price: 5.50, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500', desc: 'Fresh garden salad' },
        { name: 'Steak', price: 12.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', desc: 'Grilled steak with sauce' },
        { name: 'Sushi', price: 11.00, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', desc: 'Fresh sushi rolls' },
        { name: 'Ramen', price: 8.50, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500', desc: 'Japanese noodle soup' },
        { name: 'Donut', price: 3.00, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500', desc: 'Sweet glazed donuts' },
        { name: 'Pancakes', price: 5.00, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500', desc: 'Fluffy pancakes with syrup' },
        { name: 'Ice Cream', price: 4.50, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', desc: 'Creamy ice cream' },
        { name: 'Milkshake', price: 4.00, image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500', desc: 'Thick and creamy milkshake' },
        { name: 'Coffee', price: 2.50, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500', desc: 'Fresh brewed coffee' },
        { name: 'Cake', price: 5.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', desc: 'Delicious chocolate cake' }
    ];

    const gridContainer = document.querySelector('.grid-3');
    const title = document.querySelector('.title');

    // ===== GET SEARCH PARAMETER =====
    function getSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const storedSearch = localStorage.getItem('searchTerm');
        
        // Clear stored search after using
        if (storedSearch) {
            localStorage.removeItem('searchTerm');
        }
        
        return searchQuery || storedSearch;
    }

    // ===== DISPLAY FOOD ITEMS =====
    function displayItems(items) {
        if (!gridContainer) return;
        
        if (items.length === 0) {
            gridContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fa fa-search" style="font-size: 5rem; color: #ddd; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 1.8rem; color: #333; margin-bottom: 10px;">No Results Found</h3>
                    <p style="color: #666; margin-bottom: 25px;">We couldn't find any items matching your search</p>
                    <a href="foods.html" style="display: inline-block; padding: 12px 30px; background: #c49b63; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View All Foods</a>
                </div>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            html += `
                <div class="food-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300'">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                    <p style="font-size: 0.9rem; color: #666; padding: 0 15px; margin-bottom: 15px;">${item.desc}</p>
                    <button onclick="addToCart('${item.name}', ${item.price}, '${item.image}')" style="margin: 0 15px 20px; padding: 10px 20px; background: #c49b63; color: white; border: none; border-radius: 8px; cursor: pointer; width: calc(100% - 30px);">Add To Cart</button>
                </div>
            `;
        });
        
        gridContainer.innerHTML = html;
    }

    // ===== FILTER ITEMS BY SEARCH =====
    function filterItemsBySearch(query) {
        if (!query) return foodItems;
        
        const searchLower = query.toLowerCase();
        return foodItems.filter(item => 
            item.name.toLowerCase().includes(searchLower)
        );
    }

    // ===== UPDATE PAGE TITLE =====
    function updatePageTitle(query) {
        if (!title) return;
        
        if (query) {
            title.innerHTML = `Search Results for "${query}" <a href="foods.html" style="font-size: 1rem; margin-left: 15px; color: #ff4444; text-decoration: none;">Clear</a>`;
        } else {
            title.textContent = 'Our Foods';
        }
    }

    // ===== INITIALIZE =====
    function init() {
        const searchQuery = getSearchQuery();
        const filteredItems = filterItemsBySearch(searchQuery);
        displayItems(filteredItems);
        updatePageTitle(searchQuery);
    }

    // ===== MAKE ADD TO CART AVAILABLE GLOBALLY =====
    window.addToCart = function(name, price, image) {
        if (window.cartManager) {
            window.cartManager.addItem(name, price, image, 1);
        } else {
            // Fallback if cartManager not available
            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cart.find(i => i.foodName === name);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({
                    foodName: name,
                    foodPrice: price,
                    qty: 1,
                    image: image
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cart));
            
            // Update badge if exists
            const badge = document.querySelector('.badge');
            if (badge) {
                const totalItems = cart.reduce((total, item) => total + item.qty, 0);
                badge.innerText = totalItems;
                badge.style.display = 'flex';
            }
            
            // Show notification
            alert(`${name} added to cart!`);
        }
    };

    // Start
    init();
});