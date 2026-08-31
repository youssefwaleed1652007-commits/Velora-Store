```javascript
const WHATSAPP = "201223562957";

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL = "https://nflcafxxjhinumvxyyxt.supabase.co";
const SUPABASE_KEY = "sb_publishable_yoOuiG8GPwZbKcikdntB-g_k7K_06IQ";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================
   STORE DATA
========================= */

let products = [];
let cart = [];
let activeCategory = "الكل";


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const grid = document.getElementById("productGrid");

  if (grid) {
    grid.innerHTML = `
      <div class="empty-products">
        <div>✦</div>
        <h3>جاري تحميل المنتجات...</h3>
        <p>لحظات ونكون جاهزين.</p>
      </div>
    `;
  }

  const { data, error } = await supabaseClient
    .from("Velora")
    .select("*")
    .order("id", { ascending: false });

  if (error) {

    console.error("Supabase products error:", error);

    if (grid) {
      grid.innerHTML = `
        <div class="empty-products">
          <div>⚠️</div>
          <h3>تعذر تحميل المنتجات</h3>
          <p>حاول تحديث الصفحة مرة أخرى.</p>
        </div>
      `;
    }

    return;
  }

  products = data || [];

  renderProducts();
}


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

  const filtered = products.filter(function(product) {

    const categoryMatch =
      activeCategory === "الكل" ||
      product.category === activeCategory;

    const name =
      String(product.name || "").toLowerCase();

    const description =
      String(product.description || "").toLowerCase();

    const searchMatch =
      name.includes(query) ||
      description.includes(query);

    return categoryMatch && searchMatch;
  });


  if (!filtered.length) {

    grid.innerHTML = `
      <div class="empty-products">

        <div>✦</div>

        <h3>
          لا توجد منتجات
        </h3>

        <p>
          سيتم إضافة المنتجات قريبًا.
        </p>

      </div>
    `;

    return;
  }


  grid.innerHTML = filtered.map(function(product) {

    const image =
      product.image ||
      "";


    return (

      '<article class="product">' +

        '<div class="product-img" onclick="openProduct(' +
        product.id +
        ')">' +

          '<span class="product-badge">مميز</span>' +

          '<button class="favorite-btn" type="button" ' +
          'onclick="event.stopPropagation(); toggleFavorite(this)">' +
          '♡' +
          '</button>' +

          '<img src="' +
          image +
          '" alt="' +
          escapeHTML(product.name) +
          '" loading="lazy" ' +
          'onerror="this.style.display=\'none\'">' +

        '</div>' +

        '<div class="product-info">' +

          '<div class="product-top">' +

            '<span class="cat">' +
            escapeHTML(product.category) +
            '</span>' +

            '<span class="rating">★★★★★</span>' +

          '</div>' +

          '<h3>' +
          escapeHTML(product.name) +
          '</h3>' +

          '<p class="product-desc">' +
          escapeHTML(product.description) +
          '</p>' +

          '<div class="product-bottom">' +

            '<div class="product-price">' +

              '<strong>' +
              Number(product.price) +
              '</strong>' +

              '<span> جنيه</span>' +

            '</div>' +

            '<button class="add-btn" type="button" ' +
            'onclick="addToCart(' +
            product.id +
            ')">' +

            'أضف للسلة <span>+</span>' +

            '</button>' +

          '</div>' +

        '</div>' +

      '</article>'

    );

  }).join("");
}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
      return Number(item.id) === Number(id);
    });

  if (!product) return;


  const modal =
    document.createElement("div");

  modal.className =
    "modal product-details-modal";


  modal.innerHTML =

    '<div class="modal-overlay" ' +
    'onclick="this.parentElement.remove()"></div>' +

    '<div class="modal-box product-details-box">' +

      '<button class="close" type="button" ' +
      'onclick="this.closest(\'.modal\').remove()">×</button>' +

      '<div class="product-details-image">' +

        '<img src="' +
        product.image +
        '" alt="' +
        escapeHTML(product.name) +
        '">' +

      '</div>' +

      '<div class="product-details-content">' +

        '<span class="cat">' +
        escapeHTML(product.category) +
        '</span>' +

        '<h2>' +
        escapeHTML(product.name) +
        '</h2>' +

        '<div class="rating">★★★★★</div>' +

        '<div class="details-price">' +
        Number(product.price) +
        ' جنيه</div>' +

        '<p>' +
        escapeHTML(product.description) +
        '</p>' +

        '<div class="details-quantity">' +

          '<button type="button" ' +
          'onclick="changeDetailsQty(-1)">−</button>' +

          '<b id="detailsQty">1</b>' +

          '<button type="button" ' +
          'onclick="changeDetailsQty(1)">+</button>' +

        '</div>' +

        '<button class="primary full" type="button" ' +
        'onclick="addToCart(' +
        product.id +
        '); this.closest(\'.modal\').remove()">' +

        'أضف للسلة' +

        '</button>' +

      '</div>' +

    '</div>';


  document.body.appendChild(modal);
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
   CART
========================= */

function addToCart(id) {

  const product =
    products.find(function(item) {
      return Number(item.id) === Number(id);
    });

  if (!product) return;


  const existing =
    cart.find(function(item) {
      return Number(item.id) === Number(id);
    });


  if (existing) {

    existing.qty++;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      category: product.category,

      price: Number(product.price),

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

      return sum +
        Number(item.price) *
        item.qty;

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

    cartItems.innerHTML =

      '<div class="cart-empty">' +

        '<div>🛍️</div>' +

        '<h3>السلة فارغة</h3>' +

        '<p>أضيفي بعض القطع الجميلة للبدء.</p>' +

      '</div>';

    return;
  }


  cartItems.innerHTML =
    cart.map(function(item) {

      return (

        '<div class="cart-line">' +

          '<div class="cart-product">' +

            '<strong>' +
            escapeHTML(item.name) +
            '</strong>' +

            '<span class="cat">' +
            item.price +
            ' جنيه للقطعة</span>' +

          '</div>' +

          '<div class="quantity">' +

            '<button type="button" ' +
            'onclick="changeQty(' +
            item.id +
            ', -1)">−</button>' +

            '<b>' +
            item.qty +
            '</b>' +

            '<button type="button" ' +
            'onclick="changeQty(' +
            item.id +
            ', 1)">+</button>' +

          '</div>' +

          '<strong class="cart-price">' +

            Number(item.price) *
            item.qty +

            ' جنيه</strong>' +

        '</div>'

      );

    }).join("");
}


/* =========================
   CHANGE CART QUANTITY
========================= */

function changeQty(id, change) {

  const item =
    cart.find(function(product) {

      return Number(product.id) === Number(id);

    });


  if (!item) return;


  item.qty += change;


  if (item.qty <= 0) {

    cart =
      cart.filter(function(product) {

        return Number(product.id) !== Number(id);

      });

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

    alert("السلة فارغة");

    return;
  }


  const lines =
    cart.map(function(item) {

      return (

        "• " +
        item.name +
        " × " +
        item.qty +
        " — " +
        Number(item.price) *
        item.qty +
        " جنيه"

      );

    }).join("\n");


  const total =
    cart.reduce(function(sum, item) {

      return sum +
        Number(item.price) *
        item.qty;

    }, 0);


  const message =

    "مرحبًا VELORA، أريد طلب:\n\n" +

    lines +

    "\n\nالإجمالي: " +
    total +
    " جنيه\n\n" +

    "الاسم:\n" +

    "العنوان:\n" +

    "رقم الهاتف:";


  window.open(

    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(message),

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
   SEARCH
========================= */

document.addEventListener("input", function(event) {

  if (event.target.id === "search") {

    renderProducts();

  }

});


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

    loadProducts();

  }
);


/* =========================
   ESC
========================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeCart();

    }

  }
);
```
