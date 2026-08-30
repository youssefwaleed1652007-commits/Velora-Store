const WHATSAPP = "201223562957";

let cart = [];
let activeCategory = "الكل";

/* =========================
PRODUCT DATA
========================= */

const products = [
{
id: 1,
name: "خاتم أوراق",
category: "خواتم",
price: 280
},
{
id: 2,
name: "سلسلة فاني كليف",
category: "سلاسل",
price: 320
},
{
id: 3,
name: "أسورة فاني كليف",
category: "أساور",
price: 350
},
{
id: 4,
name: "حلق دائري فخم",
category: "حلق",
price: 300
},
{
id: 5,
name: "خاتم ناعم",
category: "خواتم",
price: 240
},
{
id: 6,
name: "سلسلة نجمة",
category: "سلاسل",
price: 290
},
{
id: 7,
name: "أسورة رفيعة",
category: "أساور",
price: 260
},
{
id: 8,
name: "حلق لؤلؤ",
category: "حلق",
price: 330
}
];

/* =========================
SEARCH + FILTER
========================= */

function filterProducts(category) {

activeCategory = category;

const grid = document.getElementById("productGrid");

if (!grid) return;

const searchInput = document.getElementById("search");

const query = searchInput
? searchInput.value.trim().toLowerCase()
: "";

const cards = grid.querySelectorAll(".product");

cards.forEach(function(card) {

```
const productName =
  card.querySelector("h3")?.textContent.toLowerCase() || "";

const productCategory =
  card.querySelector(".cat")?.textContent.trim() || "";


const categoryMatch =
  activeCategory === "الكل" ||
  productCategory === activeCategory;


const searchMatch =
  productName.includes(query);


if (categoryMatch && searchMatch) {
  card.style.display = "";
} else {
  card.style.display = "none";
}
```

});

grid.scrollIntoView({
behavior: "smooth",
block: "start"
});

}

function renderProducts() {

const grid = document.getElementById("productGrid");

if (!grid) return;

const searchInput = document.getElementById("search");

const query = searchInput
? searchInput.value.trim().toLowerCase()
: "";

const cards = grid.querySelectorAll(".product");

cards.forEach(function(card) {

```
const productName =
  card.querySelector("h3")?.textContent.toLowerCase() || "";

const productCategory =
  card.querySelector(".cat")?.textContent.trim() || "";


const categoryMatch =
  activeCategory === "الكل" ||
  productCategory === activeCategory;


const searchMatch =
  productName.includes(query);


if (categoryMatch && searchMatch) {
  card.style.display = "";
} else {
  card.style.display = "none";
}
```

});

}

/* =========================
ADD TO CART
========================= */

function addToCart(id) {

const product =
products.find(function(item) {
return item.id === id;
});

if (!product) return;

const existing =
cart.find(function(item) {
return item.id === id;
});

if (existing) {

```
existing.qty++;
```

} else {

```
cart.push({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  qty: 1
});
```

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

const totalQuantity =
cart.reduce(function(sum, item) {
return sum + item.qty;
}, 0);

const totalPrice =
cart.reduce(function(sum, item) {
return sum + (item.price * item.qty);
}, 0);

if (cartCount) {
cartCount.textContent = totalQuantity;
}

if (cartTotal) {
cartTotal.textContent = totalPrice;
}

if (!cartItems) return;

if (cart.length === 0) {

```
cartItems.innerHTML = `
  <div class="cart-empty">
    <div>🛍️</div>
    <h3>السلة فارغة</h3>
    <p>أضيفي بعض القطع الجميلة للبدء.</p>
  </div>
`;

return;
```

}

cartItems.innerHTML = cart.map(function(item) {

```
return `
  <div class="cart-line">

    <div class="cart-product">

      <strong>
        ${item.name}
      </strong>

      <span class="cat">
        ${item.price} جنيه للقطعة
      </span>

    </div>


    <div class="quantity">

      <button
        type="button"
        onclick="changeQty(${item.id}, -1)"
      >
        −
      </button>

      <b>
        ${item.qty}
      </b>

      <button
        type="button"
        onclick="changeQty(${item.id}, 1)"
      >
        +
      </button>

    </div>


    <strong class="cart-price">
      ${item.price * item.qty} جنيه
    </strong>

  </div>
`;
```

}).join("");

}

/* =========================
CHANGE QUANTITY
========================= */

function changeQty(id, change) {

const item =
cart.find(function(product) {
return product.id === id;
});

if (!item) return;

item.qty += change;

if (item.qty <= 0) {

```
cart =
  cart.filter(function(product) {
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
WHATSAPP CHECKOUT
========================= */

function checkout() {

if (cart.length === 0) {

```
alert("السلة فارغة");

return;
```

}

const lines =
cart.map(function(item) {

```
  return `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`;

}).join("\n");
```

const total =
cart.reduce(function(sum, item) {

```
  return sum + (item.price * item.qty);

}, 0);
```

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

```
nav.classList.remove("mobile-open");
```

}

});

/* =========================
ESCAPE KEY
========================= */

document.addEventListener("keydown", function(event) {

if (event.key === "Escape") {

```
closeCart();
```

}

});

/* =========================
INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", function() {

updateCart();

renderProducts();

});
