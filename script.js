/* =========================================================
   VELORA STORE
   Supabase + Products + Options + Cart + WhatsApp
========================================================= */

const WHATSAPP = "201223562957";

const SUPABASE_URL =
  "https://nflcafxxjhinumvxyyxt.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_yoOuiG8GPwZbKcikdntB-g_k7K_06IQ";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


let products = [];
let cart = [];
let activeCategory = "الكل";


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function normalizeArray(value) {

  if (Array.isArray(value)) {

    return value
      .map(function(item) {
        return String(item).trim();
      })
      .filter(Boolean);

  }

  return [];
}


/* =========================================================
   LOAD PRODUCTS
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
        '<h3>تعذر تحميل المنتجات</h3>' +
        '<p>حاول تحديث الصفحة مرة أخرى.</p>' +
      '</div>';


    return;
  }


  products =
    Array.isArray(result.data)
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


  const searchInput =
    document.getElementById("search");


  const query =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  const filtered =
    products.filter(function(product) {

      const categoryMatch =
        activeCategory === "الكل" ||
        String(product.category || "") === activeCategory;


      const name =
        String(product.name || "")
          .toLowerCase();


      const description =
        String(product.description || "")
          .toLowerCase();


      return (
        categoryMatch &&
        (
          !query ||
          name.includes(query) ||
          description.includes(query)
        )
      );

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
            onclick="openProduct(${Number(product.id)})"
            style="
              cursor:pointer;
              position:relative;
            "
          >

            ${
              image
                ? `
                  <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name || "")}"
                    loading="lazy"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                      display:block;
                    "
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
              onclick="openProduct(${Number(product.id)})"
            >
              عرض التفاصيل
            </button>

          </div>

        </article>

      `;

    }).join("");
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterProducts(category) {

  activeCategory =
    category || "الكل";


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


  const colors =
    normalizeArray(product.colors);


  const sizes =
    normalizeArray(product.sizes);


  const modal =
    document.createElement("div");


  modal.className =
    "modal product-details-modal";


  modal.innerHTML = `

    <div
      class="modal-overlay"
      onclick="this.parentElement.remove()"
    ></div>


    <div
      class="modal-box product-details-box"
      style="
        position:relative;
        width:min(94vw,560px);
        max-height:92vh;
        overflow-y:auto;
        overflow-x:hidden;
        padding:20px;
        border-radius:20px;
      "
    >


      <button
        class="close"
        type="button"
        onclick="this.closest('.modal').remove()"
        style="
          position:absolute;
          top:10px;
          right:10px;
          z-index:10;
        "
      >
        ×
      </button>


      <!-- IMAGE -->

      <div
        class="product-details-image"
        style="
          width:100%;
          height:320px;
          max-height:42vh;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          background:#171514;
          border-radius:16px;
          margin-bottom:20px;
        "
      >

        ${
          product.image
            ? `
              <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name || "")}"
                style="
                  width:100%;
                  height:100%;
                  object-fit:contain;
                  display:block;
                "
              >
            `
            : `
              <span style="font-size:70px;">
                ✦
              </span>
            `
        }

      </div>


      <!-- INFORMATION -->

      <div
        class="product-details-content"
        style="
          text-align:right;
        "
      >

        <span class="cat">
          ${escapeHTML(product.category || "")}
        </span>


        <h2>
          ${escapeHTML(product.name || "")}
        </h2>


        <div class="rating">
          ★★★★★
        </div>


        <div
          class="details-price"
          style="
            font-size:22px;
            font-weight:bold;
            margin:10px 0;
          "
        >
          ${Number(product.price || 0)}
          جنيه
        </div>


        ${
          product.description
            ? `
              <p>
                ${escapeHTML(product.description)}
              </p>
            `
            : ""
        }


        <!-- COLOR -->

        ${
          colors.length
            ? `

              <div
                style="
                  margin-top:20px;
                "
              >

                <strong>
                  اللون
                </strong>


                <div
                  id="colorOptions"
                  style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:10px;
                  "
                >

                  <button
                    type="button"
                    class="option-btn"
                    data-value=""
                    onclick="selectProductOption(this)"
                    style="
                      padding:9px 14px;
                      border:1px solid #777;
                      border-radius:9px;
                      background:transparent;
                      color:#fff;
                    "
                  >
                    اختر اللون
                  </button>


                  ${colors.map(function(color) {

                    return `

                      <button
                        type="button"
                        class="option-btn"
                        data-value="${escapeHTML(color)}"
                        onclick="selectProductOption(this)"
                        style="
                          padding:9px 14px;
                          border:1px solid #c9a96e;
                          border-radius:9px;
                          background:transparent;
                          color:#fff;
                        "
                      >
                        ${escapeHTML(color)}
                      </button>

                    `;

                  }).join("")}

                </div>

              </div>

            `
            : ""
        }


        <!-- SIZE -->

        ${
          sizes.length
            ? `

              <div
                style="
                  margin-top:20px;
                "
              >

                <strong>
                  المقاس
                </strong>


                <div
                  id="sizeOptions"
                  style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:10px;
                  "
                >

                  <button
                    type="button"
                    class="option-btn"
                    data-value=""
                    onclick="selectProductOption(this)"
                    style="
                      padding:9px 14px;
                      border:1px solid #777;
                      border-radius:9px;
                      background:transparent;
                      color:#fff;
                    "
                  >
                    اختر المقاس
                  </button>


                  ${sizes.map(function(size) {

                    return `

                      <button
                        type="button"
                        class="option-btn"
                        data-value="${escapeHTML(size)}"
                        onclick="selectProductOption(this)"
                        style="
                          padding:9px 14px;
                          border:1px solid #c9a96e;
                          border-radius:9px;
                          background:transparent;
                          color:#fff;
                        "
                      >
                        ${escapeHTML(size)}
                      </button>

                    `;

                  }).join("")}

                </div>

              </div>

            `
            : ""
        }


        <!-- QUANTITY -->

        <div
          class="details-quantity"
          style="
            display:flex;
            align-items:center;
            justify-content:center;
            gap:20px;
            margin:24px 0;
          "
        >

          <button
            type="button"
            onclick="changeDetailsQty(-1)"
          >
            −
          </button>


          <b
            id="detailsQty"
            style="
              font-size:18px;
            "
          >
            1
          </b>


          <button
            type="button"
            onclick="changeDetailsQty(1)"
          >
            +
          </button>

        </div>


        <!-- ADD -->

        <button
          class="primary full"
          type="button"
          onclick="addDetailsProductToCart(${Number(product.id)})"
        >
          أضف للسلة
        </button>


        <p
          id="optionError"
          style="
            display:none;
            color:#d9a96e;
            margin-top:12px;
            text-align:center;
          "
        ></p>

      </div>

    </div>

  `;


  document.body.appendChild(modal);
}


/* =========================================================
   SELECT OPTION
========================================================= */

function selectProductOption(button) {

  if (!button) return;


  const parent =
    button.parentElement;


  parent
    .querySelectorAll(".option-btn")
    .forEach(function(item) {

      item.classList.remove(
        "selected"
      );


      item.style.background =
        "transparent";


      item.style.color =
        "#fff";

    });


  button.classList.add(
    "selected"
  );


  const value =
    button.getAttribute(
      "data-value"
    );


  if (value) {

    button.style.background =
      "#c9a96e";


    button.style.color =
      "#171514";

  }
}


/* =========================================================
   GET SELECTED OPTION
========================================================= */

function getSelectedOption(containerId) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) return "";


  const selected =
    container.querySelector(
      ".option-btn.selected"
    );


  if (!selected) return "";


  return (
    selected.getAttribute(
      "data-value"
    ) || ""
  );
}


/* =========================================================
   DETAILS QUANTITY
========================================================= */

function changeDetailsQty(change) {

  const element =
    document.getElementById(
      "detailsQty"
    );


  if (!element) return;


  let quantity =
    parseInt(
      element.textContent,
      10
    ) || 1;


  quantity += change;


  if (quantity < 1) {

    quantity = 1;

  }


  element.textContent =
    quantity;
}


/* =========================================================
   ADD DETAILS PRODUCT
========================================================= */

function addDetailsProductToCart(id) {

  const product =
    products.find(function(item) {

      return Number(item.id) === Number(id);

    });


  if (!product) return;


  const colors =
    normalizeArray(product.colors);


  const sizes =
    normalizeArray(product.sizes);


  const color =
    colors.length
      ? getSelectedOption(
          "colorOptions"
        )
      : "";


  const size =
    sizes.length
      ? getSelectedOption(
          "sizeOptions"
        )
      : "";


  const error =
    document.getElementById(
      "optionError"
    );


  /* =======================================================
     REQUIRE COLOR
  ======================================================= */

  if (
    colors.length &&
    !color
  ) {

    if (error) {

      error.textContent =
        "من فضلك اختر اللون أولًا.";

      error.style.display =
        "block";

    }

    return;
  }


  /* =======================================================
     REQUIRE SIZE
  ======================================================= */

  if (
    sizes.length &&
    !size
  ) {

    if (error) {

      error.textContent =
        "من فضلك اختر المقاس أولًا.";

      error.style.display =
        "block";

    }

    return;
  }


  const qtyElement =
    document.getElementById(
      "detailsQty"
    );


  const quantity =
    qtyElement
      ? Math.max(
          1,
          parseInt(
            qtyElement.textContent,
            10
          ) || 1
        )
      : 1;


  addConfiguredProductToCart(
    product,
    color,
    size,
    quantity
  );


  const modal =
    document.querySelector(
      ".product-details-modal"
    );


  if (modal) {

    modal.remove();

  }
}


/* =========================================================
   ADD CONFIGURED PRODUCT
========================================================= */

function addConfiguredProductToCart(
  product,
  color,
  size,
  quantity
) {

  const existing =
    cart.find(function(item) {

      return (
        Number(item.id) === Number(product.id) &&
        item.color === color &&
        item.size === size
      );

    });


  if (existing) {

    existing.qty += quantity;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      category: product.category,

      price:
        Number(product.price || 0),

      image:
        product.image || "",

      color:
        color,

      size:
        size,

      qty:
        quantity

    });

  }


  updateCart();

  openCart();
}


/* =========================================================
   ADD SIMPLE PRODUCT
========================================================= */

function addToCart(id) {

  const product =
    products.find(function(item) {

      return Number(item.id) === Number(id);

    });


  if (!product) return;


  const colors =
    normalizeArray(product.colors);


  const sizes =
    normalizeArray(product.sizes);


  if (
    colors.length ||
    sizes.length
  ) {

    openProduct(id);

    return;
  }


  addConfiguredProductToCart(
    product,
    "",
    "",
    1
  );
}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

  const cartCount =
    document.getElementById(
      "cartCount"
    );


  const cartItems =
    document.getElementById(
      "cartItems"
    );


  const cartTotal =
    document.getElementById(
      "cartTotal"
    );


  const totalQuantity =
    cart.reduce(function(sum, item) {

      return sum + item.qty;

    }, 0);


  const totalPrice =
    cart.reduce(function(sum, item) {

      return (
        sum +
        Number(item.price || 0) *
        item.qty
      );

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
    cart.map(function(item, index) {

      return `

        <div
          class="cart-line"
          style="
            padding:15px 0;
            border-bottom:1px solid rgba(255,255,255,.08);
          "
        >

          <div
            class="cart-product"
            style="
              display:flex;
              flex-direction:column;
              gap:5px;
            "
          >

            ${
              item.image
                ? `
                  <img
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    style="
                      width:60px;
                      height:60px;
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


            ${
              item.color
                ? `
                  <span>
                    اللون: ${escapeHTML(item.color)}
                  </span>
                `
                : ""
            }


            ${
              item.size
                ? `
                  <span>
                    المقاس: ${escapeHTML(item.size)}
                  </span>
                `
                : ""
            }


            <span class="cat">
              ${Number(item.price)} جنيه للقطعة
            </span>

          </div>


          <div class="quantity">

            <button
              type="button"
              onclick="changeQty(${index}, -1)"
            >
              −
            </button>


            <b>
              ${item.qty}
            </b>


            <button
              type="button"
              onclick="changeQty(${index}, 1)"
            >
              +
            </button>

          </div>


          <strong class="cart-price">
            ${
              Number(item.price) *
              item.qty
            }
            جنيه
          </strong>

        </div>

      `;

    }).join("");
}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeQty(index, change) {

  if (!cart[index]) return;


  cart[index].qty +=
    change;


  if (
    cart[index].qty <= 0
  ) {

    cart.splice(
      index,
      1
    );

  }


  updateCart();
}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

  const modal =
    document.getElementById(
      "cartModal"
    );


  if (!modal) return;


  modal.classList.remove(
    "hidden"
  );


  updateCart();
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

  const modal =
    document.getElementById(
      "cartModal"
    );


  if (!modal) return;


  modal.classList.add(
    "hidden"
  );
}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkout() {

  if (!cart.length) {

    alert(
      "السلة فارغة"
    );

    return;
  }


  const lines =
    cart.map(function(item) {

      let line =
        "• " +
        item.name;


      if (item.color) {

        line +=
          " | اللون: " +
          item.color;

      }


      if (item.size) {

        line +=
          " | المقاس: " +
          item.size;

      }


      line +=
        " | الكمية: " +
        item.qty;


      line +=
        " | " +
        (
          Number(item.price) *
          item.qty
        ) +
        " جنيه";


      return line;

    }).join("\n");


  const total =
    cart.reduce(function(sum, item) {

      return (
        sum +
        Number(item.price || 0) *
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


  const url =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(
      message
    );


  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

  const nav =
    document.getElementById(
      "mainNav"
    );


  if (!nav) return;


  nav.classList.toggle(
    "mobile-open"
  );
}


document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.closest(
        "nav a"
      )
    ) {

      const nav =
        document.getElementById(
          "mainNav"
        );


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
      event.target.id ===
      "search"
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
      event.key ===
      "Escape"
    ) {

      closeCart();


      document
        .querySelectorAll(
          ".product-details-modal"
        )
        .forEach(function(modal) {

          modal.remove();

        });

    }

  }
);


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

    loadProducts();

  }
);
