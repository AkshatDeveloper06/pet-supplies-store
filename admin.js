/* ==========================================================================
   Happy Paws Admin Portal - Logic & Management
   Author: Akshat Rana (Roll No: 2545022)
   Subject: ITWS (HTML, CSS & JavaScript)
   ========================================================================== */

// Global State
let allOrders = [];
let filteredOrders = [];
let activeStatusFilter = "all";
let searchKeyword = "";

// DOM Elements
const statTotalOrders = document.getElementById("statTotalOrders");
const statTotalRevenue = document.getElementById("statTotalRevenue");
const statPendingOrders = document.getElementById("statPendingOrders");
const statDeliveredOrders = document.getElementById("statDeliveredOrders");

const ordersTableBody = document.getElementById("ordersTableBody");
const emptyOrdersView = document.getElementById("emptyOrdersView");
const orderSearchInput = document.getElementById("orderSearchInput");
const statusFilter = document.getElementById("statusFilter");
const clearAllOrdersBtn = document.getElementById("clearAllOrdersBtn");
const addSampleOrdersBtn = document.getElementById("addSampleOrdersBtn");
const emptyLoadSampleBtn = document.getElementById("emptyLoadSampleBtn");

// Invoice Modal Elements
const orderDetailModal = document.getElementById("orderDetailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const closeInvoiceBtn = document.getElementById("closeInvoiceBtn");
const modalDetailOrderId = document.getElementById("modalDetailOrderId");
const modalCustomerName = document.getElementById("modalCustomerName");
const modalCustomerPhone = document.getElementById("modalCustomerPhone");
const modalCustomerAddress = document.getElementById("modalCustomerAddress");
const modalCustomerCity = document.getElementById("modalCustomerCity");
const modalCustomerNotes = document.getElementById("modalCustomerNotes");
const modalOrderDate = document.getElementById("modalOrderDate");
const modalOrderPayment = document.getElementById("modalOrderPayment");
const modalOrderStatusBadge = document.getElementById("modalOrderStatusBadge");
const modalItemsList = document.getElementById("modalItemsList");
const modalSubtotal = document.getElementById("modalSubtotal");
const modalDelivery = document.getElementById("modalDelivery");
const modalGrandTotal = document.getElementById("modalGrandTotal");

// Inventory Quick Grid
const inventoryMiniGrid = document.getElementById("inventoryMiniGrid");
const inventoryCountBadge = document.getElementById("inventoryCountBadge");

// --------------------------------------------------------------------------
// 1. Initial Load
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    loadOrders();
    loadInventory();
    setupEventListeners();
});

// --------------------------------------------------------------------------
// 2. Load & Save Orders
// --------------------------------------------------------------------------
function loadOrders() {
    try {
        const stored = localStorage.getItem("happyPawsOrders");
        if (stored) {
            allOrders = JSON.parse(stored);
        } else {
            allOrders = [];
        }
    } catch (e) {
        console.error("Error reading happyPawsOrders from localStorage:", e);
        allOrders = [];
    }

    applyFilters();
    updateDashboardStats();
}

function saveOrdersToStorage() {
    try {
        localStorage.setItem("happyPawsOrders", JSON.stringify(allOrders));
    } catch (e) {
        console.error("Error saving happyPawsOrders to localStorage:", e);
    }
}

// --------------------------------------------------------------------------
// 3. Update Metrics & Statistics
// --------------------------------------------------------------------------
function updateDashboardStats() {
    const totalOrdersCount = allOrders.length;
    statTotalOrders.textContent = totalOrdersCount;

    // Calculate revenue (excluding cancelled orders)
    const revenue = allOrders
        .filter(o => o.status !== "Cancelled")
        .reduce((sum, o) => sum + (o.total || 0), 0);
    statTotalRevenue.textContent = `₹${revenue.toLocaleString('en-IN')}`;

    // Count by status
    const pendingCount = allOrders.filter(o => o.status === "Pending").length;
    const deliveredCount = allOrders.filter(o => o.status === "Delivered").length;

    statPendingOrders.textContent = pendingCount;
    statDeliveredOrders.textContent = deliveredCount;
}

// --------------------------------------------------------------------------
// 4. Filter & Search Logic
// --------------------------------------------------------------------------
function applyFilters() {
    filteredOrders = allOrders.filter(order => {
        // Status match
        const matchesStatus = (activeStatusFilter === "all") || (order.status === activeStatusFilter);

        // Search keyword match
        let matchesSearch = true;
        if (searchKeyword.trim() !== "") {
            const q = searchKeyword.toLowerCase().trim();
            const idMatch = order.id.toLowerCase().includes(q);
            const nameMatch = order.customer && order.customer.name.toLowerCase().includes(q);
            const phoneMatch = order.customer && order.customer.phone.includes(q);
            const cityMatch = order.customer && order.customer.city.toLowerCase().includes(q);
            const addressMatch = order.customer && order.customer.address.toLowerCase().includes(q);

            matchesSearch = idMatch || nameMatch || phoneMatch || cityMatch || addressMatch;
        }

        return matchesStatus && matchesSearch;
    });

    renderOrdersTable();
}

// --------------------------------------------------------------------------
// 5. Render Orders Table
// --------------------------------------------------------------------------
function renderOrdersTable() {
    ordersTableBody.innerHTML = "";

    if (filteredOrders.length === 0) {
        emptyOrdersView.style.display = "block";
        document.querySelector(".orders-table").style.display = "none";
        return;
    }

    emptyOrdersView.style.display = "none";
    document.querySelector(".orders-table").style.display = "table";

    filteredOrders.forEach(order => {
        const row = document.createElement("tr");

        // Format items summary
        const itemsSummary = order.items.map(i => `${i.name.slice(0, 22)}... (×${i.quantity})`).join(", ");
        const itemsCount = order.itemCount || order.items.reduce((sum, i) => sum + i.quantity, 0);

        row.innerHTML = `
            <td class="order-id-cell">
                <strong>${order.id}</strong>
                <span class="order-date-text">${order.date || 'N/A'} at ${order.time || ''}</span>
            </td>
            <td class="customer-cell">
                <strong>${escapeHtml(order.customer.name)}</strong>
                <span class="customer-phone"><i class="fa-solid fa-phone"></i> ${escapeHtml(order.customer.phone)}</span>
                <p class="customer-address-summary" title="${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)}">
                    ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)} (${escapeHtml(order.customer.pincode)})
                </p>
            </td>
            <td>
                <span class="order-items-count-badge">${itemsCount} item${itemsCount === 1 ? '' : 's'}</span>
                <div class="order-items-summary" title="${escapeHtml(itemsSummary)}" style="margin-top: 4px; font-size: 0.78rem; color: #475569;">
                    ${escapeHtml(itemsSummary.length > 40 ? itemsSummary.slice(0, 40) + '...' : itemsSummary)}
                </div>
            </td>
            <td class="total-amount-cell">
                ₹${order.total}
            </td>
            <td>
                <span class="payment-badge">${order.paymentMethod || 'Cash on Delivery'}</span>
            </td>
            <td>
                <select class="status-dropdown ${order.status}" onchange="changeOrderStatus('${order.id}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Dispatched" ${order.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-sm" onclick="openOrderDetails('${order.id}')" title="View Order Invoice">
                        <i class="fa-solid fa-file-invoice"></i> View
                    </button>
                    <button class="btn-icon-sm btn-delete-sm" onclick="deleteOrder('${order.id}')" title="Delete Order">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;

        ordersTableBody.appendChild(row);
    });
}

// --------------------------------------------------------------------------
// 6. Change Order Status
// --------------------------------------------------------------------------
function changeOrderStatus(orderId, newStatus) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    saveOrdersToStorage();
    updateDashboardStats();
    applyFilters();
}

// --------------------------------------------------------------------------
// 7. Delete Single Order
// --------------------------------------------------------------------------
function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    allOrders = allOrders.filter(o => o.id !== orderId);
    saveOrdersToStorage();
    updateDashboardStats();
    applyFilters();
}

// --------------------------------------------------------------------------
// 8. Clear All Orders
// --------------------------------------------------------------------------
function clearAllOrders() {
    if (allOrders.length === 0) return;
    if (!confirm("Are you sure you want to delete ALL customer orders? This cannot be undone.")) return;

    allOrders = [];
    saveOrdersToStorage();
    updateDashboardStats();
    applyFilters();
}

// --------------------------------------------------------------------------
// 9. View Order Details / Invoice Modal
// --------------------------------------------------------------------------
function openOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    modalDetailOrderId.textContent = order.id;
    modalCustomerName.textContent = order.customer.name;
    modalCustomerPhone.textContent = order.customer.phone;
    modalCustomerAddress.textContent = order.customer.address;
    modalCustomerCity.textContent = `${order.customer.city} - ${order.customer.pincode}`;
    modalCustomerNotes.textContent = order.customer.notes || "None";

    modalOrderDate.textContent = `${order.date || 'N/A'} at ${order.time || ''}`;
    modalOrderPayment.textContent = order.paymentMethod || "Cash on Delivery";

    modalOrderStatusBadge.textContent = order.status;
    modalOrderStatusBadge.className = `status-badge-${order.status.toLowerCase()}`;

    // Populate line items
    modalItemsList.innerHTML = "";
    order.items.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "modal-item-row";
        itemRow.innerHTML = `
            <div class="modal-item-title-wrap">
                <img src="${item.image}" alt="${item.name}" class="modal-item-thumb">
                <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.78rem; color: #64748b;">₹${item.price} each</div>
                </div>
            </div>
            <div>
                <span style="font-weight: 600;">Qty: ${item.quantity}</span> &nbsp;|&nbsp; 
                <strong style="color: #2b7a78;">₹${item.price * item.quantity}</strong>
            </div>
        `;
        modalItemsList.appendChild(itemRow);
    });

    modalSubtotal.textContent = `₹${order.subtotal || (order.total - (order.delivery || 0))}`;
    modalDelivery.textContent = (order.delivery === 0) ? "FREE" : `₹${order.delivery || 0}`;
    modalGrandTotal.textContent = `₹${order.total}`;

    orderDetailModal.classList.add("active");
}

function closeOrderDetails() {
    orderDetailModal.classList.remove("active");
}

// --------------------------------------------------------------------------
// 10. Load Sample Demonstration Orders (For Viva / Testing)
// --------------------------------------------------------------------------
function loadSampleOrders() {
    const sampleOrders = [
        {
            id: "#HP-58912",
            date: "28 Oct 2026",
            time: "11:20 AM",
            timestamp: Date.now() - 3600000 * 5,
            customer: {
                name: "Gurpreet Singh",
                phone: "9814012345",
                address: "#45, Model Town Extension",
                city: "Ludhiana",
                pincode: "141002",
                notes: "Please call on arrival, dog is friendly."
            },
            items: [
                {
                    id: 1,
                    name: "Pedigree Adult Dry Dog Food (Chicken & Veg, 3kg)",
                    price: 649,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: 3,
                    name: "Durable Rubber Dog Chew Bone",
                    price: 299,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60"
                }
            ],
            itemCount: 2,
            subtotal: 948,
            delivery: 0,
            total: 948,
            paymentMethod: "Cash on Delivery",
            status: "Delivered"
        },
        {
            id: "#HP-64301",
            date: "28 Oct 2026",
            time: "02:45 PM",
            timestamp: Date.now() - 3600000 * 2,
            customer: {
                name: "Simran Kaur",
                phone: "9872087654",
                address: "Flat 301, Silver Heights, Pakhowal Road",
                city: "Ludhiana",
                pincode: "141013",
                notes: "Leave with security if not available."
            },
            items: [
                {
                    id: 2,
                    name: "Whiskas Wet Cat Food (Ocean Fish Gravy, 12 Packs)",
                    price: 480,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: 4,
                    name: "Interactive Feather Cat Wand Toy",
                    price: 199,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60"
                }
            ],
            itemCount: 3,
            subtotal: 1159,
            delivery: 0,
            total: 1159,
            paymentMethod: "UPI / QR (Demo)",
            status: "Dispatched"
        },
        {
            id: "#HP-71884",
            date: "28 Oct 2026",
            time: "05:10 PM",
            timestamp: Date.now() - 1800000,
            customer: {
                name: "Aman Verma",
                phone: "9988776655",
                address: "House 12-B, South City",
                city: "Ludhiana",
                pincode: "141027",
                notes: "Ring the door bell twice."
            },
            items: [
                {
                    id: 6,
                    name: "Natural Oatmeal Anti-Itch Pet Shampoo (250ml)",
                    price: 389,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop&q=60"
                }
            ],
            itemCount: 1,
            subtotal: 389,
            delivery: 40,
            total: 429,
            paymentMethod: "Cash on Delivery",
            status: "Pending"
        }
    ];

    allOrders = [...sampleOrders, ...allOrders];
    saveOrdersToStorage();
    updateDashboardStats();
    applyFilters();
}

// --------------------------------------------------------------------------
// 11. Load Store Inventory Preview (From products.json)
// --------------------------------------------------------------------------
async function loadInventory() {
    try {
        const response = await fetch("products.json");
        if (!response.ok) throw new Error("Status " + response.status);
        const catalog = await response.json();
        renderInventoryMini(catalog);
    } catch (e) {
        console.warn("Could not fetch products.json in admin, using empty fallback");
        inventoryCountBadge.textContent = "Catalog Synced";
    }
}

function renderInventoryMini(catalog) {
    inventoryCountBadge.textContent = `${catalog.length} Active Items`;
    inventoryMiniGrid.innerHTML = "";

    catalog.forEach(item => {
        const card = document.createElement("div");
        card.className = "mini-product-card";
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="mini-product-img">
            <div class="mini-product-info">
                <h5>${item.name}</h5>
                <span>${item.category} &bull; <strong class="mini-product-price">₹${item.price}</strong></span>
            </div>
        `;
        inventoryMiniGrid.appendChild(card);
    });
}

// --------------------------------------------------------------------------
// 12. Event Listeners Setup
// --------------------------------------------------------------------------
function setupEventListeners() {
    // Status Filter
    statusFilter.addEventListener("change", function () {
        activeStatusFilter = this.value;
        applyFilters();
    });

    // Search Input
    orderSearchInput.addEventListener("input", function () {
        searchKeyword = this.value;
        applyFilters();
    });

    // Action buttons
    clearAllOrdersBtn.addEventListener("click", clearAllOrders);
    addSampleOrdersBtn.addEventListener("click", loadSampleOrders);
    emptyLoadSampleBtn.addEventListener("click", loadSampleOrders);

    // Modal close
    closeDetailModalBtn.addEventListener("click", closeOrderDetails);
    closeInvoiceBtn.addEventListener("click", closeOrderDetails);
    orderDetailModal.addEventListener("click", function (e) {
        if (e.target === orderDetailModal) {
            closeOrderDetails();
        }
    });
}

// Helper to escape HTML characters
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
