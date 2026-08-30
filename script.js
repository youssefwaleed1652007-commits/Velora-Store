const WHATSAPP = "201223562957";

let cart = [];

/* =========================
PRODUCTS
البيانات تستخدم للسلة
والتفاصيل فقط
========================= */

const products = [
{
id: 1,
name: "خاتم أوراق",
category: "خواتم",
price: 280,
icon: "💍",
image: "",
badge: "جديد",
rating: 5,
description: "تصميم ناعم وأنيق لإطلالة يومية مميزة."
},

{
id: 2,
name: "سلسلة فاني كليف",
category: "سلاسل",
price: 320,
icon: "📿",
image: "",
badge: "الأكثر مبيعًا",
rating: 5,
description: "سلسلة راقية بتصميم أنيق يناسب مختلف المناسبات."
},

{
id: 3,
name: "أسورة فاني كليف",
category: "أساور",
price: 350,
icon: "✨",
image: "",
badge: "جديد",
rating: 5,
description: "لمسة فاخرة وبسيطة تكمل إطلالتك بسهولة."
},

{
id: 4,
name: "حلق دائري فخم",
category: "حلق",
price: 300,
icon: "💎",
image: "",
badge: "مميز",
rating: 5,
description: "تصميم بسيط وأنيق يمنحك حضورًا راقيًا."
},

{
id: 5,
name: "خاتم ناعم",
category: "خواتم",
price: 240,
icon: "💍",
image: "",
badge: "",
rating: 5,
description: "قطعة بسيطة تناسب الإطلالات اليومية."
},

{
id: 6,
name: "سلسلة نجمة",
category: "سلاسل",
price: 290,
icon: "📿",
image: "",
badge: "",
rating: 5,
description: "تصميم رقيق مستوحى من النجوم لإطلالة مميزة."
},

{
id: 7,
name: "أسورة رفيعة",
category: "أساور",
price: 260,
icon: "✨",
image: "",
badge: "جديد",
rating: 5,
description: "تصميم رفيع وأنيق لإطلالة ناعمة."
},

{
id: 8,
name: "حلق لؤلؤ",
category: "حلق",
price: 330,
icon: "💎",
image: "",
badge: "مميز",
rating: 5,
description: "لمسة ناعمة مستوحاة من جمال اللؤلؤ."
}
];

/* =========================
START
مهم:
لا يوجد renderProducts هنا
========================= */

document.addEventListener("DOMContentLoaded", function () {

updateCart();

setupSearch();

});

/* =========================
SEARCH
يبحث في المنتجات الموجودة
داخل index.html
========================= */

function setupSearch() {

const search =
document.getElementById("search");

if (!search) return;

search.addEventListener("input", function () {

```
const query =
  search.value.trim().toLowerCase();

const cards =
  document.querySelectorAll(".product-card");

cards.forEach(function (card) {

  const nameElement =
    card.querySelector("h3");

  const category =
    card.dataset.category || "";

  const name =
    nameElement
      ? nameElement.textContent.toLowerCase()
      : "";

  if (
    name.includes(query) ||
    category.toLowerCase().includes(query)
  ) {

    card.style.display = "";

  } else {

    card.style.display = "none";

  }

});
```

});

}

/* =========================
FILTER PRODUCTS
========================= */

function filterProducts(category) {

const cards =
document.querySelectorAll(".product-card");

cards.forEach(function (card) {

```
const cardCategory =
  card.dataset.category;

if (
  category === "الكل" ||
  cardCategory === category
) {

  card.style.display = "";

} else {

  card.style.display = "none";

}
```

});

const search =
document.getElementById("search");

if (search) {
search.value = "";
}

const section =
document.getElementById("products");

if (section) {

```
section.scrollIntoView({
  behavior: "smooth"
});
```

}

}

/* =========================
FAVORITES
========================= */

function toggleFavorite(button) {

if (!button) return;

button.classList.toggle("active");

button.textContent =
button.classList.contains("active")
? "♥"
: "♡";

}

/* =========================
PRODUCT DETAILS
========================= */

function openProduct(id) {

const product =
products.find(function (item) {
return item.id === id;
});

if (!product) return;

const modal =
document.createElement("div");

modal.className =
"modal product-details-modal";

modal.innerHTML = `

```
<div
  class="modal-overlay"
  onclick="this.parentElement.remove()"
></div>

<div class="modal-box product-details-box">

  <button
    class="close"
    type="button"
    onclick="this.closest('.modal').remove()"
  >
    ×
  </button>

  <div class="product-details-image">

    ${
      product.image
        ? `
          <img
            src="${product.image}"
            alt="${product.name}"
          >
        `
        : `
          <div class="product-placeholder large">
            ${product.icon}
          </div>
        `
    }

  </div>

  <div class="product-details-content">

    <span class="cat">
      ${product.category}
    </span>

    <h2>
      ${product.name}
    </h2>

    <div class="rating">
      ${"★".repeat(product.rating || 5)}
    </div>

    <div class="details-price">
      ${product.price} جنيه
    </div>

    <p>
      ${product.description}
    </p>

    <div class="details-option">

      <strong>
        اللون
      </strong>

      <div class="option-buttons">

        <button
          type="button"
          class="option selected"
          onclick="selectOption(this)"
        >
          ذهبي
        </button>

        <button
          type="button"
          class="option"
          onclick="selectOption(this)"
        >
          فضي
        </button>

      </div>

    </div>

    <div class="details-option">

      <strong>
        المقاس
      </strong>

      <div class="option-buttons">

        <button
          type="button"
          class="option selected"
          onclick="selectOption(this)"
        >
          عادي
        </button>

      </div>

    </div>

    <div class="details-quantity">

      <button
        type="button"
        onclick="changeDetailsQty(-1)"
      >
        −
      </button>

      <b id="detailsQty">
        1
      </b>

      <button
        type="button"
        onclick="changeDetailsQty(1)"
      >
        +
      </button>

    </div>

    <button
      type="button"
      class="primary full"
      onclick="
        addToCart(${product.id});
        this.closest('.modal').remove();
      "
    >
      أضف للسلة
    </button>

  </div>

</div>
```

`;

document.body.appendChild(modal);

}

/* =========================
SELECT OPTIONS
========================= */

function selectOption(button) {

if (!button) return;

const container =
button.parentElement;

container
.querySelectorAll(".option")
.forEach(function (item) {

```
  item.classList.remove("selected");

});
```

button.classList.add("selected");

}

/* =========================
DETAILS QUANTITY
========================= */

function changeDetailsQty(change) {

const element =
document.getElementById("detailsQty");

if (!element) return;

let quantity =
parseInt(element.textContent) || 1;

quantity += change;

if (quantity < 1) {
quantity = 1;
}

element.textContent = quantity;

}

/* =========================
ADD TO CART
========================= */

function addToCart(id) {

const product =
products.find(function (item) {
return item.id === id;
});

if (!product) return;

const existing =
cart.find(function (item) {
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
cart.reduce(function (sum, item) {

```
  return sum + item.qty;

}, 0);
```

const totalPrice =
cart.reduce(function (sum, item) {

```
  return sum + item.price * item.qty;

}, 0);
```

if (cartCount) {

```
cartCount.textContent =
  totalQuantity;
```

}

if (cartTotal) {

```
cartTotal.textContent =
  totalPrice.toLocaleString("ar-EG");
```

}

if (!cartItems) return;

if (!cart.length) {

```
cartItems.innerHTML = `

  <div class="cart-empty">

    <div>
      🛍️
    </div>

    <h3>
      السلة فارغة
    </h3>

    <p>
      أضيفي بعض القطع الجميلة للبدء.
    </p>

  </div>

`;

return;
```

}

cartItems.innerHTML =
cart.map(function (item) {

```
  return `

    <div class="cart-line">

      <div class="cart-product">

        <strong>
          ${item.name}
        </strong>

        <span class="cat">
          ${item.price.toLocaleString("ar-EG")} جنيه للقطعة
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

        ${(item.price * item.qty).toLocaleString("ar-EG")}
        جنيه

      </strong>

    </div>

  `;

}).join("");
```

}

/* =========================
CHANGE CART QUANTITY
========================= */

function changeQty(id, change) {

const item =
cart.find(function (product) {
return product.id === id;
});

if (!item) return;

item.qty += change;

if (item.qty <= 0) {

```
cart =
  cart.filter(function (product) {
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

if (!cart.length) {

```
alert("السلة فارغة");

return;
```

}

const lines =
cart.map(function (item) {

```
  return `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`;

}).join("\n");
```

const total =
cart.reduce(function (sum, item) {

```
  return sum + item.price * item.qty;

}, 0);
```

const message =
`مرحبًا VELORA، أريد طلب:

${lines}

الإجمالي: ${total} جنيه

الاسم:
العنوان:
رقم الهاتف:`;

window.open(
`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
"_blank"
);

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

document.addEventListener("click", function (event) {

if (event.target.closest("#mainNav a")) {

```
const nav =
  document.getElementById("mainNav");

if (nav) {
  nav.classList.remove("mobile-open");
}
```

}

});

/* =========================
ESC KEY
========================= */

document.addEventListener("keydown", function (event) {

if (event.key === "Escape") {

```
closeCart();
```

}

});
