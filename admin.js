alert("VELORA ADMIN JS WORKING");
alert("admin.js شغال");
```javascript
// ================================
// VELORA ADMIN PANEL
// ================================

const STORAGE_KEY = "velora_products";

// عناصر الصفحة
const productForm = document.getElementById("productForm");
const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const productsList = document.getElementById("productsList");

// وضع التعديل
let editingProductId = null;

// ================================
// تحميل المنتجات
// ================================

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error loading products:", error);
        return [];
    }
}

// ================================
// حفظ المنتجات
// ================================

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ================================
// معاينة الصورة
// ================================

productImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        imagePreview.innerHTML = "<span>لم يتم اختيار صورة</span>";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        imagePreview.innerHTML = `
            <img src="${event.target.result}" alt="معاينة المنتج">
        `;

    };

    reader.readAsDataURL(file);
});

// ================================
// إضافة / تعديل منتج
// ================================

productForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value;
    const description = document.getElementById("productDescription").value.trim();
    const rating = Number(document.getElementById("productRating").value);
    const badge = document.getElementById("productBadge").value;

    if (!name || !price || !category) {
        alert("من فضلك املأ البيانات الأساسية للمنتج.");
        return;
    }

    const products = getProducts();

    // ============================
    // تعديل منتج موجود
    // ============================

    if (editingProductId !== null) {

        const productIndex = products.findIndex(
            product => product.id === editingProductId
        );

        if (productIndex === -1) {
            alert("المنتج غير موجود.");
            return;
        }

        products[productIndex].name = name;
        products[productIndex].price = price;
        products[productIndex].category = category;
        products[productIndex].description = description;
        products[productIndex].rating = rating;
        products[productIndex].badge = badge;

        // لو اختار صورة جديدة
        const file = productImage.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = function (event) {

                products[productIndex].image = event.target.result;

                saveProducts(products);
                resetForm();
                renderProducts();

                alert("تم تعديل المنتج بنجاح ✅");
            };

            reader.readAsDataURL(file);

        } else {

            saveProducts(products);
            resetForm();
            renderProducts();

            alert("تم تعديل المنتج بنجاح ✅");
        }

        return;
    }

    // ============================
    // إضافة منتج جديد
    // ============================

    const file = productImage.files[0];

    if (!file) {
        alert("من فضلك اختر صورة للمنتج.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const newProduct = {

            id: Date.now(),

            name: name,

            price: price,

            category: category,

            description: description,

            rating: rating,

            badge: badge,

            image: event.target.result

        };

        products.push(newProduct);

        saveProducts(products);

        resetForm();

        renderProducts();

        alert("تمت إضافة المنتج بنجاح ✅");
    };

    reader.readAsDataURL(file);
});

// ================================
// عرض المنتجات
// ================================

function renderProducts() {

    const products = getProducts();

    if (products.length === 0) {

        productsList.innerHTML = `
            <div class="empty-products">
                <span>📦</span>
                <p>لا توجد منتجات حاليًا</p>
            </div>
        `;

        return;
    }

    productsList.innerHTML = "";

    products.forEach(product => {

        const item = document.createElement("div");

        item.className = "product-item";

        item.innerHTML = `

            <div class="product-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-item-info">

                <h3>${product.name}</h3>

                <p>
                    ${product.category}
                    ${product.badge ? " • " + product.badge : ""}
                </p>

            </div>

            <div class="product-item-price">
                ${product.price} جنيه
            </div>

            <div class="product-actions">

                <button
                    class="edit-btn"
                    onclick="editProduct(${product.id})"
                >
                    ✏️ تعديل
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${product.id})"
                >
                    🗑️ حذف
                </button>

            </div>
        `;

        productsList.appendChild(item);
    });
}

// ================================
// تعديل منتج
// ================================

function editProduct(id) {

    const products = getProducts();

    const product = products.find(
        item => item.id === id
    );

    if (!product) {
        alert("المنتج غير موجود.");
        return;
    }

    editingProductId = id;

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productRating").value = product.rating || 5;
    document.getElementById("productBadge").value = product.badge || "";

    imagePreview.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
    `;

    document.querySelector(".add-product-btn").textContent =
        "💾 حفظ التعديلات";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ================================
// حذف منتج
// ================================

function deleteProduct(id) {

    const confirmed = confirm(
        "هل أنت متأكد أنك تريد حذف هذا المنتج؟"
    );

    if (!confirmed) {
        return;
    }

    let products = getProducts();

    products = products.filter(
        product => product.id !== id
    );

    saveProducts(products);

    renderProducts();

    alert("تم حذف المنتج 🗑️");
}

// ================================
// إعادة ضبط الفورم
// ================================

function resetForm() {

    productForm.reset();

    editingProductId = null;

    imagePreview.innerHTML =
        "<span>لم يتم اختيار صورة</span>";

    document.querySelector(".add-product-btn").textContent =
        "➕ إضافة المنتج";
}

// ================================
// تشغيل الصفحة
// ================================

renderProducts();
```
