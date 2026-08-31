/* =========================================================
   VELORA - MAIN SCRIPT
   Supabase + Products + Search + Categories + Cart + WhatsApp
========================================================= */

const WHATSAPP = "201112989746";

const SUPABASE_URL = "https://nflcafxxjhinumvxyyxt.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_yoOuiG8GPwZbKcikdntB-g_k7K_06IQ";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================================
   GLOBAL DATA
========================================================= */

let products = [];
let cart = [];
let activeCategory = "الكل";


/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */

async function loadProducts() {

  const grid =
    document.getElementById("productGrid");

  if (!grid) return;

  grid.innerHTML =
    '<div class="empty-products">' +
      '<div>⏳</div>' +
      '<h3>جاري تحميل المنتجات...</h3>' +
      '<p>انتظري لحظات.</p>' +
    '</div>';


  const result =
    await supabaseClient
      .from("Velora")
      .select("*")
      .order("id", {
        ascending: true
      });


  if (result.error) {

    console.error(
      "Supabase Error:",
      result.error
    );

    grid.innerHTML =
      '<div class="empty-products">' +
        '<div>⚠️</div>' +
        '<h3>حدث خطأ</h3>' +
        '<p>تعذر تحميل المنتجات حاليًا.</p>' +
      '</div>';

    return;
  }


  products = Array.isArray(result.data)
    ? result.data
    : [];


  renderProducts();
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

  const grid =
    document.getElementById("productGrid");

  if (!grid) return;


  const search =
    document.getElementById("search");


  const query =
    search
      ? search.value.trim().toLowerCase()
      : "";


  const filtered =
    products.filter(function(product) {

      const categoryMatch =
        activeCategory === "الكل" ||
        product.category === activeCategory;


      const name =
        String(product.name || "")
          .toLowerCase();


      const description =
        String(product.description || "")
          .toLowerCase();


      const searchMatch =
        name.includes(query) ||
        description.includes(query);


      return categoryMatch && searchMatch;

    });


  if (!filtered.length) {

    grid.innerHTML =
      '<div class="empty-products">' +
        '<div>✦</div>' +
        '<h3>لا توجد منتجات</h3>' +
        '<p>سيتم إضافة المنتجات قريبًا.</p>' +
      '</div>';

    return;
  }


  grid.innerHTML =
    filtered.map(function(product) {

      const image =
        product.image || "";


      return `

        <article class="product-card">

          <div
            class="product-image"
            onclick="openProduct(${product.id})"
            style="cursor:pointer;"
          >

            ${
              image
                ? `
                  <img
                    src="${image}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                      display:block;
                    "
                    onerror="this.style.display='none';"
                  >
                `
                : `
                  <span>✦</span>
                `
            }

            <button
              class="favorite-btn"
              type="button"
              onclick="event.stopPropagation(); toggleFavorite(this)"
              aria-label="إضافة للمفضلة"
            >
              ♡
            </button>

          </div>


          <div class="product-info">

            <small>
              ${escapeHTML(product.category || "")}
            </small>


            <h3>
              ${escapeHTML(product.name || "")}
            </h3>


            ${
              product.description
                ? `
                  <p class="product-desc">
                    ${escapeHTML(product.description)}
                  </p>
                `
                : ""
            }


            <p class="product-price">
              ${Number(product.price || 0)} جنيه
            </p>


            <button
              class="primary full"
              type="button"
              onclick="addToCart(${product.id})"
            >
              أضف للسلة
            </button>

          </div>

        </article>

      `;

    }).join("");
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

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


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(button) {

  if (!button) return;


  button.classList.toggle("active");


  button.textContent =
    button.classList.contains("active")
      ? "♥"
      : "♡";
}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

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


  const image =
    product.image || "";


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

        ${
          image
            ? `
              <img
                src="${image}"
                alt="${escapeHTML(product.name)}"
              >
            `
            : `
              <div
                style="
                  height:100%;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:70px;
                "
              >
                ✦
              </div>
            `
        }

      </div>


      <div class="product-details-content">

        <span class="cat">
          ${escapeHTML(product.category || "")}
        </span>


        <h2>
          ${escapeHTML(product.name || "")}
        </h2>


        <div class="rating">
          ★★★★★
        </div>


        <div class="details-price">
          ${Number(product.price || 0)} جنيه
        </div>


        <p>
          ${escapeHTML(
            product.description ||
            "قطعة أنيقة من مجموعة VELORA."
          )}
        </p>


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
          class="primary full"
          type="button"
          onclick="addDetailsToCart(${product.id}); this.closest('.modal').remove()"
        >
          أضف للسلة
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(modal);
}


/* =========================================================
   PRODUCT DETAILS QUANTITY
========================================================= */

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


/* =========================================================
   ADD DETAILS PRODUCT TO CART
========================================================= */

function addDetailsToCart(id) {

  const product =
    products.find(function(item) {

      return Number(item.id) === Number(id);

    });


  if (!product) return;


  const qtyElement =
    document.getElementById("detailsQty");


  const quantity =
    qtyElement
      ? Math.max(
          1,
          parseInt(qtyElement.textContent) || 1
        )
      : 1;


  const existing =
    cart.find(function(item) {

      return Number(item.id) === Number(id);

    });


  if (existing) {

    existing.qty += quantity;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      category: product.category,

      price: Number(product.price) || 0,

      image: product.image || "",

      qty: quantity

    });

  }


  updateCart();

  openCart();
}


/* =========================================================
   ADD TO CART
========================================================= */

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

      price: Number(product.price) || 0,

      image: product.image || "",

      qty: 1

    });

  }


  updateCart();

  openCart();
}


/* =========================================================
   UPDATE CART
========================================================= */

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
        (Number(item.price) * item.qty);

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

        <div>🛍️</div>

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

            ${
              item.image
                ? `
                  <img
                    src="${item.image}"
                    alt="${escapeHTML(item.name)}"
                    style="
                      width:55px;
                      height:55px;
                      object-fit:cover;
                      border-radius:10px;
                    "
                  >
                `
                : ""
            }


            <strong>
              ${escapeHTML(item.name)}
            </strong>


            <span class="cat">
              ${Number(item.price)} جنيه للقطعة
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
            ${Number(item.price) * item.qty} جنيه
          </strong>

        </div>

      `;

    }).join("");
}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

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


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

  const modal =
    document.getElementById("cartModal");


  if (!modal) return;


  modal.classList.remove("hidden");


  updateCart();
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

  const modal =
    document.getElementById("cartModal");


  if (!modal) return;


  modal.classList.add("hidden");
}


/* =========================================================
   CHECKOUT WHATSAPP
========================================================= */

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
        (
          Number(item.price) *
          item.qty
        ) +
        " جنيه"
      );

    }).join("\n");


  const total =
    cart.reduce(function(sum, item) {

      return sum +
        (
          Number(item.price) *
          item.qty
        );

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


  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(message);


  window.open(
    whatsappURL,
    "_blank"
  );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

  const nav =
    document.getElementById("mainNav");


  if (!nav) return;


  nav.classList.toggle(
    "mobile-open"
  );
}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.closest("nav a")
    ) {

      const nav =
        document.getElementById("mainNav");


      if (nav) {

        nav.classList.remove(
          "mobile-open"
        );

      }

    }

  }
);


/* =========================================================
   SEARCH
========================================================= */

document.addEventListener(
  "input",
  function(event) {

    if (
      event.target.id === "search"
    ) {

      renderProducts();

    }

  }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Escape"
    ) {

      closeCart();


      const productModal =
        document.querySelector(
          ".product-details-modal"
        );


      if (productModal) {

        productModal.remove();

      }

    }

  }
);


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

    loadProducts();

  }
);
