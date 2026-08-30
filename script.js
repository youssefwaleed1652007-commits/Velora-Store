const WHATSAPP = "201223562957";

let cart = [];

const products = [
  {
    id: 1,
    name: "خاتم أوراق",
    price: 280,
    category: "خواتم"
  },
  {
    id: 2,
    name: "سلسلة فاني كليف",
    price: 320,
    category: "سلاسل"
  },
  {
    id: 3,
    name: "أسورة فاني كليف",
    price: 350,
    category: "أساور"
  },
  {
    id: 4,
    name: "حلق دائري فخم",
    price: 300,
    category: "حلق"
  },
  {
    id: 5,
    name: "خاتم ناعم",
    price: 240,
    category: "خواتم"
  },
  {
    id: 6,
    name: "سلسلة نجمة",
    price: 290,
    category: "سلاسل"
  },
  {
    id: 7,
    name: "أسورة رفيعة",
    price: 260,
    category: "أساور"
  },
  {
    id: 8,
    name: "حلق لؤلؤ",
    price: 330,
    category: "حلق"
  }
];


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function () {
  updateCart();
  setupSearch();
});


/* =========================
   ADD TO CART
========================= */

function addToCart(id) {

  const product = products.find(function (item) {
    return item.id === id;
  });

  if (!product) {
    return;
  }

  const existing = cart.find(function (item) {
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

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach(function (item) {
    totalQuantity += item.qty;
    totalPrice += item.price * item.qty;
  });

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }

  if (cartTotal) {
    cartTotal.textContent = totalPrice;
  }

  if (!cartItems) {
    return;
  }

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="cart-empty">
        <div>🛍️</div>
        <h3>السلة فارغة</h3>
        <p>أضيفي بعض القطع الجميلة للبدء.</p>
      </div>
    `;

    return;
  }

  cartItems.innerHTML = cart.map(function (item) {

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
   CHANGE QUANTITY
========================= */

function changeQty(id, change) {

  const item = cart.find(function (product) {
    return product.id === id;
  });

  if (!item) {
    return;
  }

  item.qty += change;

  if (item.qty <= 0) {

    cart = cart.filter(function (product) {
      return product.id !== id;
    });

  }

  updateCart();
}


/* =========================
   OPEN CART
========================= */

function openCart() {

  const modal = document.getElementById("cartModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("hidden");

  updateCart();
}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

  const modal = document.getElementById("cartModal");

  if (!modal) {
    return;
  }

  modal.classList.add("hidden");
}


/* =========================
   FILTER
========================= */

function filterProducts(category) {

  const cards = document.querySelectorAll(".product-card");

  cards.forEach(function (card) {

    const cardCategory = card.dataset.category;

    if (
      category === "الكل" ||
      cardCategory === category
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }

  });

  const search = document.getElementById("search");

  if (search) {
    search.value = "";
  }

  const section = document.getElementById("products");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}


/* =========================
   SEARCH
========================= */

function setupSearch() {

  const search = document.getElementById("search");

  if (!search) {
    return;
  }

  search.addEventListener("input", function () {

    const query = search.value
      .trim()
      .toLowerCase();

    const cards =
      document.querySelectorAll(".product-card");

    cards.forEach(function (card) {

      const nameElement =
        card.querySelector("h3");

      const name =
        nameElement
          ? nameElement.textContent.toLowerCase()
          : "";

      const category =
        card.dataset.category
          ? card.dataset.category.toLowerCase()
          : "";

      if (
        name.includes(query) ||
        category.includes(query)
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });
}


/* =========================
   WHATSAPP
========================= */

function checkout() {

  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  let message =
    "مرحبًا VELORA، أريد طلب:\n\n";

  cart.forEach(function (item) {

    message +=
      "• " +
      item.name +
      " × " +
      item.qty +
      " — " +
      (item.price * item.qty) +
      " جنيه\n";

  });

  const total =
    cart.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0);

  message +=
    "\nالإجمالي: " +
    total +
    " جنيه\n\n";

  message +=
    "الاسم:\nالعنوان:\nرقم الهاتف:";

  const url =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

  const nav =
    document.getElementById("mainNav");

  if (!nav) {
    return;
  }

  nav.classList.toggle("mobile-open");
}


/* =========================
   CLOSE MENU
========================= */

document.addEventListener("click", function (event) {

  if (event.target.closest("#mainNav a")) {

    const nav =
      document.getElementById("mainNav");

    if (nav) {
      nav.classList.remove("mobile-open");
    }

  }

});


/* =========================
   ESC
========================= */

document.addEventListener("keydown", function (event) {

  if (event.key === "Escape") {
    closeCart();
  }

});
