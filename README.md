# Happy Paws - Pet Supplies Store Website

**ITWS (HTML, CSS & JavaScript) Project**  
- **Student Name:** Akshat Rana  
- **University Roll No:** 2545022  
- **Course:** B.Tech CSE (3rd Semester)  
- **Institute:** PCTE Institute of Engineering & Technology, Ludhiana  

---

## 📌 Project Overview
Happy Paws is a responsive front-end online pet store website developed strictly using vanilla **HTML5**, **CSS3**, and **JavaScript**, with product data stored dynamically in **JSON** format and a dedicated **Admin Management Portal**.

---

## 🚀 Key Features Implemented

1. **Dynamic JSON Data (`products.json`):**
   - All product information (id, name, category, price, rating, image, description) is stored in a clean `products.json` file.
   - Products are dynamically loaded using `fetch()`. If you modify or add items to `products.json`, the store catalog updates automatically.
   - Includes graceful fallback so the site runs smoothly whether opened directly via file or through a local server.

2. **Customer Delivery Details Modal:**
   - Before completing an order, users are prompted to enter their delivery information:
     - **Full Name**
     - **Phone Number** (with 10-digit mobile validation)
     - **Street / House Address**
     - **City** & **Pincode** (6 digits)
     - **Delivery Notes** (Optional)
     - **Payment Option** (Cash on Delivery or UPI / QR Demo)
   - Real-time preview of order items and payable amount.

3. **Admin Orders Management Portal (`admin.html`):**
   - **Dashboard Statistics:** Live metrics for *Total Orders*, *Total Revenue (₹)*, *Pending Orders*, and *Delivered Orders*.
   - **Orders Management Table:** Complete record of each order with customer contact info, delivery address, items ordered, total amount, and payment mode.
   - **Interactive Status Updater:** Change any order's status (`Pending` ➔ `Processing` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled`) via dropdown, updating metrics and persistence in real time.
   - **Detailed Invoice Modal:** View complete order breakdown with line items and print support (`window.print()`).
   - **Order Search & Filter:** Filter by status or search by customer name, phone, city, or Order ID.
   - **Demo Sample Loader:** Click "Load Sample Orders" to instantly populate sample orders for viva/evaluation demonstrations.
   - **Active Inventory View:** Shows active items synchronized with `products.json`.

4. **Product Categories & Live Search:**
   - 5 categories: Pet Food, Toys, Grooming, Accessories, and Care Products.
   - Instant search and price/rating sorting.

5. **Full Shopping Cart Drawer:**
   - Real-time quantity adjustments, subtotal, and automatic free delivery calculation (Orders ≥ ₹499 get Free Delivery, else ₹40).
   - Saved in `localStorage`.

---

## 📁 File Structure
```text
Pet Supplies Store/
├── index.html       # Customer storefront, product catalog, cart drawer & delivery modal
├── style.css        # Clean CSS styling (Flexbox, Grid, modals, and responsive design)
├── script.js        # JSON fetch, cart operations, delivery form, and DOM handling
├── products.json    # JSON database for all pet supply products
├── admin.html       # Store Admin Dashboard & Orders Management Portal
├── admin.css        # Dashboard styling, metric cards, status badges, and print CSS
├── admin.js         # Order filtering, statistics calculation, status change & invoice modal
└── README.md        # Project documentation and viva presentation guide
```

---

## 💻 How to Run
1. **Direct Browser Access:** Double-click [index.html](file:///d:/College/Sem%203/ITWS/Pet%20Supplies%20Store/index.html) to open the store. Click the **"Admin Portal"** link in the top bar, header, or footer to access the admin view.
2. **Local Server (Recommended for dynamic JSON fetching):**
   Run inside this directory:
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080/index.html` in your web browser.
