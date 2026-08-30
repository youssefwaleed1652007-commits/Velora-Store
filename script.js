const WHATSAPP = "201223562957";

const products = [
{
id: 1,
name: "خاتم أوراق",
category: "خواتم",
price: 280,
icon: "💍",
image: ""
},
{
id: 2,
name: "سلسلة فاني كليف",
category: "سلاسل",
price: 320,
icon: "📿",
image: ""
},
{
id: 3,
name: "أسورة فاني كليف",
category: "أساور",
price: 350,
icon: "✨",
image: ""
},
{
id: 4,
name: "حلق دائري فخم",
category: "حلق",
price: 300,
icon: "💎",
image: ""
},
{
id: 5,
name: "خاتم ناعم",
category: "خواتم",
price: 240,
icon: "💍",
image: ""
},
{
id: 6,
name: "سلسلة نجمة",
category: "سلاسل",
price: 290,
icon: "📿",
image: ""
},
{
id: 7,
name: "أسورة رفيعة",
category: "أساور",
price: 260,
icon: "✨",
image: ""
},
{
id: 8,
name: "حلق لؤلؤ",
category: "حلق",
price: 330,
icon: "💎",
image: ""
}
];

let activeCategory = "الكل";
let cart = [];

/* =========================
SHOW PRODUCTS
========================= */

function renderProducts() {

const grid = document.getElementById("productGrid");

if (!grid) {
console.log("productGrid not found");
return;
}

const search = document.getElementById("search");

const query = search
? search.value.trim().toLowerCase()
: "";

const filteredProducts = products.filter(function(product) {

```
const categoryMatch =
  activeCategory === "الكل" ||
  product.category === activeCategory;

const searchMatch =
  product.name.toLowerCase().includes(query);

return categoryMatch && searchMatch;
```

});

if (filteredProducts.length === 0) {

```
grid.innerHTML = `
  <div class="empty-products">
    <div>✦</div>
    <h3>لا توجد منتجات</h3>
    <p>جربي قسمًا أو بحثًا مختلفًا.</p>
  </div>
`;

return;
```

}

grid.innerHTML = filteredProducts.map(function(product) {

```
return `
  <article class="product">

    <div class="product-img">

      ${
        product.image
          ? `<img
              src="${product.image}"
              alt="${product.name}"
            >`
          : `<div class="product-placeholder">
              ${product.icon}
            </div>`
      }

    </div>

    <div class="product-info">

      <span class="cat">
        ${product.category}
      </span>

      <h3>
        ${product.name}
      </h3>

      <div class="price">
        ${product.price} جنيه
      </div>

      <button onclick="addToCart(${product.id})">
        أضف للسلة
      </button>

    </div>

  </article>
`;
```

}).join("");

}

/* =========================
FILTER
========================= */

function filterProducts(category) {

activeCategory = category;

renderProducts();

const section = document.getElementById("products");

if (section) {
section.scrollIntoView({
behavior: "smooth"
});
}

}

/* =========================
ADD TO CART
========================= */

function addToCart(id) {

const product = products.find(function(item) {
return item.id === id;
});

if (!product) return;

const existing = cart.find(function(item) {
return item.id === id;
});

if (existing) {
existing.qty += 1;
} else {
cart.push({
id: product.id,
name: product.name,
category: product.category,
price: product.price,
icon: product.icon,
qty: 1
});
}

updateCart();
openCart();

}

/* =========================
UPDATE CART
========================= */

function updateCart() {

const cartCount =
document.getElementById("cartCount");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const quantity = cart.reduce(function(sum, item) {
return sum + item.qty;
}, 0);

const total = cart.reduce(function(sum, item) {
return sum + item.price * item.qty;
}, 0);

if (cartCount) {
cartCount.textContent = quantity;
}

if (!cartItems) return;

if (cart.length === 0) {

```
cartItems.innerHTML = `
  <div style="text-align:center;padding:30px 10px;">
    <div style="font-size:45px;">🛍️</div>
    <h3>السلة فارغة</h3>
    <p style="color:#777;">
      أضيفي بعض المنتجات للبدء.
    </p>
  </div>
`;
```

} else {

```
cartItems.innerHTML = cart.map(function(item) {

  return `
    <div class="cart-line">

      <div style="flex:1;">
        <strong>${item.name}</strong>

        <div class="cat">
          ${item.price} جنيه للقطعة
        </div>
      </div>

      <div class="quantity">

        <button onclick="changeQty(${item.id}, -1)">
          −
        </button>

        <b>${item.qty}</b>

        <button onclick="changeQty(${item.id}, 1)">
          +
        </button>

      </div>

      <strong>
        ${item.price * item.qty} جنيه
      </strong>

    </div>
  `;

}).join("");
```

}

if (cartTotal) {
cartTotal.textContent = total;
}

}

/* =========================
CHANGE QUANTITY
========================= */

function changeQty(id, change) {

const item = cart.find(function(product) {
return product.id === id;
});

if (!item) return;

item.qty += change;

if (item.qty <= 0) {

```
cart = cart.filter(function(product) {
  return product.id !== id;
});
```

}

updateCart();

}

/* =========================
OPEN CART
========================= */

function openCart() {

const modal =
document.getElementById("cartModal");

if (!modal) return;

modal.classList.remove("hidden");

updateCart();

}

/* =========================
CLOSE CART
========================= */

function closeCart() {

const modal =
document.getElementById("cartModal");

if (!modal) return;

modal.classList.add("hidden");

}

/* =========================
CHECKOUT WHATSAPP
========================= */

function checkout() {

if (cart.length === 0) {
alert("السلة فارغة");
return;
}

const lines = cart.map(function(item) {
return `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`;
}).join("\n");

const total = cart.reduce(function(sum, item) {
return sum + item.price * item.qty;
}, 0);

const message =
`مرحبًا VELORA، أريد طلب:

${lines}

الإجمالي: ${total} جنيه

الاسم:
العنوان:
رقم الهاتف:`;

const url =
`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");

}

/* =========================
MOBILE MENU
========================= */

function toggleMenu() {

const nav =
document.getElementById("mainNav");

if (!nav) return;

nav.classList.toggle("mobile-open");

}

/* =========================
CLOSE MOBILE MENU
========================= */

document.addEventListener("click", function(event) {

const nav =
document.getElementById("mainNav");

if (!nav) return;

if (event.target.closest("nav a")) {
nav.classList.remove("mobile-open");
}

});

/* =========================
ESC KEY
========================= */

document.addEventListener("keydown", function(event) {

if (event.key === "Escape") {
closeCart();
}

});

/* =========================
START WEBSITE
========================= */

document.addEventListener("DOMContentLoaded", function() {

renderProducts();
updateCart();

});
