/* ==========================================================================
   Happy Paws - Pet Supplies Store
   Author: Akshat Rana (Roll No: 2545022)
   Subject: ITWS (HTML, CSS & JavaScript)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Fallback Product Data (In case products.json cannot be fetched via file:// protocol)
// --------------------------------------------------------------------------
const fallbackProducts = [
    {
        id: 1,
        name: "Pedigree Adult Dry Dog Food (Chicken & Veg, 3kg)",
        category: "Pet Food",
        price: 649,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60",
        description: "Balanced dry kibble rich in protein and vitamins for active adult dogs."
    },
    {
        id: 2,
        name: "Whiskas Wet Cat Food (Ocean Fish Gravy, 12 Packs)",
        category: "Pet Food",
        price: 480,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=60",
        description: "Tasty tender fish pouches enriched with zinc and essential fatty acids."
    },
    {
        id: 3,
        name: "Durable Rubber Dog Chew Bone",
        category: "Toys",
        price: 299,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60",
        description: "Tough non-toxic natural rubber toy to keep dogs engaged and clean teeth."
    },
    {
        id: 4,
        name: "Interactive Feather Cat Wand Toy",
        category: "Toys",
        price: 199,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60",
        description: "Flexible wand with colorful bells and feathers to encourage indoor exercise."
    },
    {
        id: 5,
        name: "Self-Cleaning Pet Slicker Grooming Brush",
        category: "Grooming",
        price: 349,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60",
        description: "Gently removes loose fur and mats with a convenient one-click hair release."
    },
    {
        id: 6,
        name: "Natural Oatmeal Anti-Itch Pet Shampoo (250ml)",
        category: "Grooming",
        price: 389,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=60",
        description: "Mild herbal formula with aloe vera for dry, sensitive and allergic coats."
    },
    {
        id: 7,
        name: "Reflective Nylon Dog Collar & Leash Set",
        category: "Accessories",
        price: 549,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=60",
        description: "Padded grip leash and collar with bright reflective stitching for night walks."
    },
    {
        id: 8,
        name: "Ultra-Soft Orthopedic Pet Bed (Medium)",
        category: "Accessories",
        price: 1199,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500&auto=format&fit=crop&q=60",
        description: "Comfortable cushioned sleeping bed with a removable, washable outer cover."
    },
    {
        id: 9,
        name: "Stainless Steel Non-Skid Pet Feeding Bowl",
        category: "Accessories",
        price: 249,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1608096299210-db7e38487075?w=500&auto=format&fit=crop&q=60",
        description: "Durable food-grade steel bowl with a silicone rubber base to prevent slipping."
    },
    {
        id: 10,
        name: "Bentonite Clumping Cat Litter (5kg Lavender)",
        category: "Care Products",
        price: 429,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60",
        description: "Fast-acting clumping litter with 99% dust-free granules and odor control."
    },
    {
        id: 11,
        name: "Biodegradable Pet Waste Bags (8 Rolls + Dispenser)",
        category: "Care Products",
        price: 220,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500&auto=format&fit=crop&q=60",
        description: "Eco-friendly leak-proof poop bags with a clip-on dispenser for walks."
    },
    {
        id: 12,
        name: "Daily Calcium & Multi-Vitamin Pet Chews (60 Tabs)",
        category: "Care Products",
        price: 399,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60",
        description: "Flavored chewable tablets supporting strong bones, joints and shiny fur."
    }
];

// Active products array loaded from products.json
let products = [];

// --------------------------------------------------------------------------
// 2. Global State Variables
// --------------------------------------------------------------------------
let cart = []; // Array of cart items { id, name, price, image, quantity }
let selectedCategory = "all";
let searchTerm = "";
let currentSort = "featured";

// --------------------------------------------------------------------------
// 3. DOM Element References
// --------------------------------------------------------------------------
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const activeFilterTag = document.getElementById("activeFilterTag");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const sortSelect = document.getElementById("sortSelect");
const categoryCards = document.querySelectorAll(".category-card");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

// Cart Elements
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartCountBadge = document.getElementById("cartCountBadge");
const drawerCartCount = document.getElementById("drawerCartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartTotal = document.getElementById("cartTotal");
const deliveryHint = document.getElementById("deliveryHint");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// Delivery Modal Elements
const deliveryModal = document.getElementById("deliveryModal");
const closeDeliveryModalBtn = document.getElementById("closeDeliveryModalBtn");
const cancelDeliveryBtn = document.getElementById("cancelDeliveryBtn");
const deliveryForm = document.getElementById("deliveryForm");
const deliveryModalItemCount = document.getElementById("deliveryModalItemCount");
const deliveryModalTotal = document.getElementById("deliveryModalTotal");

// Checkout Success Modal Elements
const checkoutModal = document.getElementById("checkoutModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalOrderId = document.getElementById("modalOrderId");
const modalCustName = document.getElementById("modalCustName");
const modalCustAddress = document.getElementById("modalCustAddress");
const modalCustPhone = document.getElementById("modalCustPhone");
const modalItemCount = document.getElementById("modalItemCount");
const modalTotalPaid = document.getElementById("modalTotalPaid");
const modalPayMethod = document.getElementById("modalPayMethod");

// Toast Notification & Navigation
const toastContainer = document.getElementById("toastContainer");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const contactForm = document.getElementById("contactForm");
const contactSuccessMsg = document.getElementById("contactSuccessMsg");

// --------------------------------------------------------------------------
// 4. Initial Load & JSON Fetch
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    // Load cart from localStorage if present
    loadCartFromStorage();

    // Dynamically fetch products from products.json
    loadProductsFromJSON();

    // Initialize all event listeners
    initEventListeners();
});

// Function to fetch products dynamically from products.json
async function loadProductsFromJSON() {
    try {
        const response = await fetch("products.json");
        if (!response.ok) {
            throw new Error(`Failed to load products.json (Status: ${response.status})`);
        }
        products = await response.json();
        console.log("Successfully loaded products from products.json:", products.length, "items");
    } catch (error) {
        console.warn("Could not fetch products.json (likely due to local file:// protocol), using built-in fallback data:", error);
        products = [...fallbackProducts];
    }

    // Render products once data is loaded
    filterAndRenderProducts();
}

// --------------------------------------------------------------------------
// 5. Product Rendering & Filtering Logic
// --------------------------------------------------------------------------
function filterAndRenderProducts() {
    // 1. Filter by category
    let filtered = products.filter(item => {
        if (selectedCategory === "all") return true;
        return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    // 2. Filter by search keyword
    if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(item => {
            return (
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        });
    }

    // 3. Sort products
    if (currentSort === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    // Update metadata info
    resultsCount.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
    activeFilterTag.textContent = selectedCategory === "all" ? "All Categories" : selectedCategory;

    // Show empty state if no products match
    if (filtered.length === 0) {
        productGrid.innerHTML = "";
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
        renderProducts(filtered);
    }
}

// Function to generate product cards HTML
function renderProducts(items) {
    productGrid.innerHTML = "";

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img-box">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                <span class="product-category-tag">${product.category}</span>
            </div>
            <div class="product-info">
                <div class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    <span class="rating-score">${product.rating}</span>
                </div>
                <h3 class="product-title" title="${product.name}">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 6. Shopping Cart Functions
// --------------------------------------------------------------------------
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if product is already in cart
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${product.name.slice(0, 22)}..." to cart!`);
}

function updateCartUI() {
    // 1. Calculate total items count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
    drawerCartCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;

    // 2. Render cart items inside drawer
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <h4>Your cart is empty</h4>
                <p>Add some supplies to see them here!</p>
            </div>
        `;
        cartSubtotal.textContent = "₹0";
        cartDelivery.textContent = "₹0";
        cartTotal.textContent = "₹0";
        deliveryHint.textContent = "Add items worth ₹499 for Free Delivery!";
        return;
    }

    cart.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    // 3. Calculate financial totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Free delivery rule: free if subtotal >= 499, otherwise ₹40 delivery fee
    const delivery = subtotal >= 499 ? 0 : 40;
    const total = subtotal + delivery;

    cartSubtotal.textContent = `₹${subtotal}`;
    cartDelivery.textContent = delivery === 0 ? "FREE" : `₹${delivery}`;
    cartTotal.textContent = `₹${total}`;

    if (subtotal >= 499) {
        deliveryHint.innerHTML = "🎉 <strong>Congratulations!</strong> You unlocked Free Delivery.";
        deliveryHint.style.color = "#059669";
    } else {
        const diff = 499 - subtotal;
        deliveryHint.textContent = `Add items worth ₹${diff} more for Free Delivery!`;
        deliveryHint.style.color = "#d97706";
    }
}

function changeQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    saveCartToStorage();
    updateCartUI();
    if (item) {
        showToast(`Removed "${item.name.slice(0, 20)}..." from cart`);
    }
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to empty your cart?")) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        showToast("Cart has been cleared");
    }
}

// --------------------------------------------------------------------------
// 7. Cart Drawer Open / Close
// --------------------------------------------------------------------------
function openCart() {
    cartOverlay.classList.add("active");
    cartDrawer.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeCart() {
    cartOverlay.classList.remove("active");
    cartDrawer.classList.remove("active");
    document.body.style.overflow = "";
}

// --------------------------------------------------------------------------
// 8. Delivery Details & Checkout Flow
// --------------------------------------------------------------------------
function initiateCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some items before checking out.");
        return;
    }

    // Calculate totals for delivery modal preview
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 499 ? 0 : 40;
    const finalAmount = subtotal + delivery;

    deliveryModalItemCount.textContent = `${totalItems} item(s)`;
    deliveryModalTotal.textContent = `₹${finalAmount}`;

    // Close the cart drawer and open the delivery modal
    closeCart();
    deliveryModal.classList.add("active");
}

function handleOrderPlacement(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        deliveryModal.classList.remove("active");
        return;
    }

    // Gather customer delivery details from form
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const city = document.getElementById("custCity").value.trim();
    const pincode = document.getElementById("custPincode").value.trim();
    const notes = document.getElementById("custNotes").value.trim();
    const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : "Cash on Delivery";

    // Financial calculations
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 499 ? 0 : 40;
    const finalAmount = subtotal + delivery;

    // Generate readable random order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#HP-${randomNum}`;
    const now = new Date();

    // Create full order record
    const newOrder = {
        id: orderId,
        date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(),
        customer: {
            name: name,
            phone: phone,
            address: address,
            city: city,
            pincode: pincode,
            notes: notes || "No special instructions"
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            itemTotal: item.price * item.quantity
        })),
        itemCount: totalItems,
        subtotal: subtotal,
        delivery: delivery,
        total: finalAmount,
        paymentMethod: paymentMethod,
        status: "Pending" // Initial status: Pending -> Processing -> Dispatched -> Delivered
    };

    // Store order into localStorage so the Admin Page can read and manage it
    saveOrderToStorage(newOrder);

    // Populate the success modal details
    modalOrderId.textContent = newOrder.id;
    modalCustName.textContent = newOrder.customer.name;
    modalCustAddress.textContent = `${newOrder.customer.address}, ${newOrder.customer.city} (${newOrder.customer.pincode})`;
    modalCustPhone.textContent = newOrder.customer.phone;
    modalItemCount.textContent = `${newOrder.itemCount} item(s)`;
    modalTotalPaid.textContent = `₹${newOrder.total}`;
    modalPayMethod.textContent = newOrder.paymentMethod;

    // Close delivery modal and show confirmation
    deliveryModal.classList.remove("active");
    checkoutModal.classList.add("active");

    // Reset delivery form
    deliveryForm.reset();

    // Empty and save cart
    cart = [];
    saveCartToStorage();
    updateCartUI();

    showToast(`Order ${orderId} placed successfully!`);
}

function saveOrderToStorage(order) {
    try {
        let orders = [];
        const saved = localStorage.getItem("happyPawsOrders");
        if (saved) {
            orders = JSON.parse(saved);
        }
        orders.unshift(order); // Add newest order at the beginning
        localStorage.setItem("happyPawsOrders", JSON.stringify(orders));
        console.log("Order saved to happyPawsOrders in localStorage:", order);
    } catch (e) {
        console.error("Could not save order to localStorage:", e);
    }
}

// --------------------------------------------------------------------------
// 9. Toast Notification Helper
// --------------------------------------------------------------------------
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-paw"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 2700);
}

// --------------------------------------------------------------------------
// 10. Local Storage Persistence
// --------------------------------------------------------------------------
function saveCartToStorage() {
    try {
        localStorage.setItem("happyPawsCart", JSON.stringify(cart));
    } catch (e) {
        console.warn("LocalStorage unavailable:", e);
    }
}

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem("happyPawsCart");
        if (saved) {
            cart = JSON.parse(saved);
            updateCartUI();
        }
    } catch (e) {
        cart = [];
    }
}

// --------------------------------------------------------------------------
// 11. Event Listeners Setup
// --------------------------------------------------------------------------
function initEventListeners() {
    // 1. Cart Drawer toggle
    openCartBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // 2. Checkout button -> Opens Delivery Details Modal
    checkoutBtn.addEventListener("click", initiateCheckout);
    clearCartBtn.addEventListener("click", clearCart);

    // 3. Delivery Details Modal actions
    closeDeliveryModalBtn.addEventListener("click", () => {
        deliveryModal.classList.remove("active");
    });

    cancelDeliveryBtn.addEventListener("click", () => {
        deliveryModal.classList.remove("active");
        openCart(); // Return to cart
    });

    deliveryForm.addEventListener("submit", handleOrderPlacement);

    // 4. Checkout Modal Close
    modalCloseBtn.addEventListener("click", () => {
        checkoutModal.classList.remove("active");
    });

    // 5. Category Filter Buttons
    categoryCards.forEach(card => {
        card.addEventListener("click", function () {
            categoryCards.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            selectedCategory = this.getAttribute("data-category");
            filterAndRenderProducts();
        });
    });

    // Footer category link shortcuts
    document.querySelectorAll(".footer-cat-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const cat = this.getAttribute("data-category");
            selectedCategory = cat;

            categoryCards.forEach(c => {
                if (c.getAttribute("data-category").toLowerCase() === cat.toLowerCase()) {
                    c.classList.add("active");
                } else {
                    c.classList.remove("active");
                }
            });

            filterAndRenderProducts();

            const targetSection = document.getElementById("products");
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 6. Live Search Input
    searchInput.addEventListener("input", function () {
        searchTerm = this.value;
        clearSearchBtn.style.display = searchTerm.length > 0 ? "block" : "none";
        filterAndRenderProducts();
    });

    clearSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        searchTerm = "";
        this.style.display = "none";
        filterAndRenderProducts();
        searchInput.focus();
    });

    // 7. Sort Dropdown
    sortSelect.addEventListener("change", function () {
        currentSort = this.value;
        filterAndRenderProducts();
    });

    // 8. Reset Filters Button
    resetFiltersBtn.addEventListener("click", function () {
        selectedCategory = "all";
        searchTerm = "";
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        sortSelect.value = "featured";
        currentSort = "featured";

        categoryCards.forEach(c => {
            if (c.getAttribute("data-category") === "all") {
                c.classList.add("active");
            } else {
                c.classList.remove("active");
            }
        });

        filterAndRenderProducts();
    });

    // 9. Mobile Navigation Toggle
    mobileMenuBtn.addEventListener("click", function () {
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 10. Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const msg = document.getElementById("contactMsg").value.trim();

            if (!name || !email || !msg) {
                alert("Please fill in all required fields.");
                return;
            }

            contactSuccessMsg.style.display = "flex";
            contactForm.reset();

            setTimeout(() => {
                contactSuccessMsg.style.display = "none";
            }, 5000);
        });
    }
}
