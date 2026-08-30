const WHATSAPP = "201223562957";

let cart = [];
let activeCategory = "الكل";

/* =========================
   PRODUCTS
========================= */

const products = [
  {
    id: 1,
    name: "أسورة Love فاخرة",
    category: "أساور",
    price: 350,
    image: "product-1.jpeg",
    icon: "✨",
    badge: "مميز",
    rating: 5,
    description: "أسورة ذهبية بتصميم أنيق وفاخر تضيف لمسة مميزة لإطلالتك."
  },

  {
    id: 2,
    name: "خاتم Crystal فاخر",
    category: "خواتم",
    price: 280,
    image: "product-2.jpeg",
    icon: "💍",
    badge: "جديد",
    rating: 5,
    description: "خاتم بتصميم فاخر وحجر لامع مناسب للإطلالات المميزة."
  },

  {
    id: 3,
    name: "أسورة Infinity",
    category: "أساور",
    price: 350,
    image: "product-3.jpeg",
    icon: "✨",
    badge: "مميز",
    rating: 5,
    description: "أسورة Infinity أنيقة بتصميم راقٍ ومميز."
  },

  {
    id: 4,
    name: "أساور ذهبية رفيعة",
    category: "أساور",
    price: 260,
    image: "product-4.jpeg",
    icon: "✨",
    badge: "جديد",
    rating: 5,
    description: "مجموعة أساور ذهبية رفيعة بتصميم ناعم وأنيق."
  }
];

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const grid = document.getElementById("productGrid");

  if (!grid) return;

  const searchInput = document.getElementById("search");

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filteredProducts = products.filter(function(product) {

    const categoryMatch =
      activeCategory === "الكل" ||
      product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(query);

    return categoryMatch && searchMatch;

  });

  if (!filteredProducts.length) {

    grid.innerHTML = `
      <div class="empty-products">

        <div>✦</div>

        <h3>
          لم نجد هذا المنتج
        </h3>

        <p>
          جربي البحث باسم مختلف.
        </p>

      </div>
    `;

    return;
  }

  grid.innerHTML = filteredProducts.map(function(product) {

    const stars = "★".repeat(product.rating || 5);

    return `

      <article class="product">

        <div
          class="product-img"
          onclick="openProduct(${product.id})"
        >

          ${
            product.badge
              ? `
                <span class="product-badge">
                  ${product.badge}
                </span>
              `
              : ""
          }

          <button
            class="favorite-btn"
            type="button"
            aria-label="إضافة للمفضلة"
            onclick="event.stopPropagation(); toggleFavorite(this)"
          >
            ♡
          </button>

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

        </div>

        <div class="product-info">

          <div class="product-top">

            <span class="cat">
              ${product.category}
            </span>

            <span class="rating">
              ${stars}
            </span>

          </div>

          <h3>
            ${product.name}
          </h3>

          <p class="product-desc">
            ${product.description}
          </p>

          <div class="product-bottom">

            <div class="product-price">

              <strong>
                ${product.price}
              </strong>

              <span>
                جنيه
              </span>

            </div>

            <button
              class="add-btn"
              type="button"
              onclick="addToCart(${product.id})"
            >
              أضف للسلة
              <span>+</span>
            </button>

          </div>

        </div>

      </article>

    `;

  }).join("");

}

/* =========================
   FILTER
========================= */

function filterProducts(category) {

  activeCategory = category;

  renderProducts();

  const section =
    document.getElementById("products");

  if (section) {

    section.scrollIntoView({
      behavior: "smooth"
    });

  }

}

/* =========================
   FAVORITES
========================= */

function toggleFavorite(button) {

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
    products.find(function(item) {
      return item.id === id;
    });

  if (!product) return;

  const modal =
    document.createElement("div");

  modal.className =
    "modal product-details-modal";

  modal.innerHTML = `

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

        <img
          src="${product.image}"
          alt="${product.name}"
        >

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

  `;

  document.body.appendChild(modal);

}

/* =========================
   OPTIONS
========================= */

function selectOption(button) {

  const container =
    button.parentElement;

  container
    .querySelectorAll(".option")
    .forEach(function(item) {

      item.classList.remove("selected");

    });

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

  element.textContent =
    quantity;

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

    existing.qty++;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      category: product.category,

      price: product.price,

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

  const totalQuantity =
    cart.reduce(function(sum, item) {

      return sum + item.qty;

    }, 0);

  const totalPrice =
    cart.reduce(function(sum, item) {

      return sum + item.price * item.qty;

    }, 0);

  if (cartCount) {

    cartCount.textContent =
      totalQuantity;

  }

  if (cartTotal) {

    cartTotal.textContent =
      totalPrice;

  }

  if (!cartItems) return;

  if (!cart.length) {

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

  }

  cartItems.innerHTML =
    cart.map(function(item) {

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

    }).join("");

}

/* =========================
   CHANGE CART QUANTITY
========================= */

function changeQty(id, change) {

  const item =
    cart.find(function(product) {
      return product.id === id;
    });

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {

    cart =
      cart.filter(function(product) {
        return product.id !== id;
      });

  }

  updateCart();

}

/* =========================
   CART
========================= */

function openCart() {

  const modal =
    document.getElementById("cartModal");

  if (!modal) return;

  modal.classList.remove("hidden");

  updateCart();

}

function closeCart() {

  const modal =
    document.getElementById("cartModal");

  if (!modal) return;

  modal.classList.add("hidden");

}

/* =========================
   WHATSAPP
========================= */

function checkout() {

  if (!cart.length) {

    alert("السلة فارغة");

    return;

  }

  const lines =
    cart.map(function(item) {

      return `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`;

    }).join("\n");

  const total =
    cart.reduce(function(sum, item) {

      return sum + item.price * item.qty;

    }, 0);

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

document.addEventListener("click", function(event) {

  if (event.target.closest("nav a")) {

    const nav =
      document.getElementById("mainNav");

    if (nav) {
      nav.classList.remove("mobile-open");
    }

  }

});

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function() {

  renderProducts();

  updateCart();

});

/* =========================
   ESC
========================= */

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {

    closeCart();

  }

});
