/* =========================================================
   VELORA STORE
========================================================= */

const WHATSAPP = "201223562957";

const SUPABASE_URL =
  "https://nflcafxxjhinumvxyyxt.supabase.co";

/*
  ضع هنا نفس Publishable Key الموجود عندك حاليًا.
  لا تستخدم service_role.
*/
const SUPABASE_KEY =
  "ضع Publishable Key هنا";


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


function getProductImages(product) {

  const images =
    normalizeArray(
      product.images
    );


  if (images.length) {

    return images;

  }


  if (product.image) {

    return [
      product.image
    ];

  }


  return [];
}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );


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
      .order(
        "id",
        {
          ascending: true
        }
      );


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
    result.data || [];


  renderProducts();
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );


  if (!grid) return;


  const search =
    document.getElementById(
      "search"
    );


  const query =
    search
      ? search.value.trim().toLowerCase()
      : "";


  const filtered =
    products.filter(
      function(product) {

        const categoryMatch =
          activeCategory === "الكل" ||
          String(product.category || "") ===
            activeCategory;


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

      }
    );


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
    filtered.map(
      function(product) {

        const images =
          getProductImages(
            product
          );


        const image =
          images[0] || "";


        return `

          <article
            class="product-card"
          >

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
                    <span>
                      ✦
                    </span>
                  `
              }


              ${
                product.badge
                  ? `
                    <span
                      class="product-badge"
                      style="
                        position:absolute;
                        top:10px;
                        right:10px;
                        z-index:5;
                        padding:6px 10px;
                        border-radius:8px;
                        background:#c9a96e;
                        color:#171514;
                        font-size:12px;
                        font-weight:bold;
                      "
                    >
                      ${escapeHTML(product.badge)}
                    </span>
                  `
                  : ""
              }


              <button
                class="favorite-btn"
                type="button"
                onclick="event.stopPropagation(); toggleFavorite(this)"
              >
                ♡
              </button>


              ${
                images.length > 1
                  ? `
                    <span
                      style="
                        position:absolute;
                        bottom:10px;
                        left:10px;
                        z-index:5;
                        background:rgba(0,0,0,.65);
                        color:#fff;
                        padding:5px 8px;
                        border-radius:8px;
                        font-size:12px;
                      "
                    >
                      ${images.length} صور
                    </span>
                  `
                  : ""
              }

            </div>


            <div
              class="product-info"
            >

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
                ${Number(product.price || 0)}
                جنيه
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

      }
    ).join("");
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterProducts(category) {

  activeCategory =
    category || "الكل";


  renderProducts();


  const section =
    document.getElementById(
      "products"
    );


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


  button.classList.toggle(
    "active"
  );


  button.textContent =
    button.classList.contains(
      "active"
    )
      ? "♥"
      : "♡";
}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function openProduct(id) {

  const product =
    products.find(
      function(item) {

        return (
          Number(item.id) ===
          Number(id)
        );

      }
    );


  if (!product) return;


  const images =
    getProductImages(
      product
    );


  const colors =
    normalizeArray(
      product.colors
    );


  const sizes =
    normalizeArray(
      product.sizes
    );


  const modal =
    document.createElement(
      "div"
    );


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
          z-index:20;
        "
      >
        ×
      </button>


      <!-- MAIN IMAGE -->

      <div
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
          margin-bottom:12px;
        "
      >

        ${
          images.length
            ? `
              <img
                id="galleryMainImage"
                src="${escapeHTML(images[0])}"
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
              <span
                style="
                  font-size:70px;
                "
              >
                ✦
              </span>
            `
        }

      </div>


      <!-- THUMBNAILS -->

      ${
        images.length > 1
          ? `
            <div
              id="galleryThumbs"
              style="
                display:flex;
                gap:8px;
                overflow-x:auto;
                padding:4px 0 12px;
              "
            >

              ${images.map(
                function(image, index) {

                  return `

                    <button
                      type="button"
                      onclick="changeGalleryImage(${Number(id)},${index})"
                      style="
                        width:65px;
                        height:65px;
                        padding:0;
                        flex:0 0 65px;
                        overflow:hidden;
                        border:2px solid ${
                          index === 0
                            ? "#c9a96e"
                            : "#3b3633"
                        };
                        border-radius:10px;
                        background:#171514;
                      "
                    >

                      <img
                        src="${escapeHTML(image)}"
                        alt="صورة ${index + 1}"
                        style="
                          width:100%;
                          height:100%;
                          object-fit:cover;
                          display:block;
                        "
                      >

                    </button>

                  `;

                }
              ).join("")}

            </div>
          `
          : ""
      }


      <!-- INFO -->

      <div
        class="product-details-content"
        style="
          text-align:right;
        "
      >

        <span class="cat">
          ${escapeHTML(product.category || "")}
        </span>


        ${
          product.badge
            ? `
              <div
                style="
                  display:inline-block;
                  margin-top:10px;
                  padding:5px 9px;
                  border-radius:7px;
                  background:#c9a96e;
                  color:#171514;
                  font-size:12px;
                  font-weight:bold;
                "
              >
                ${escapeHTML(product.badge)}
              </div>
            `
            : ""
        }


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


        <!-- COLORS -->

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


                  ${colors.map(
                    function(color) {

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

                    }
                  ).join("")}

                </div>

              </div>

            `
            : ""
        }


        <!-- SIZES -->

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


                  ${sizes.map(
                    function(size) {

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

                    }
                  ).join("")}

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
            style="font-size:18px;"
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


        <button
          class="primary full"
          type="button"
          onclick="addDetailsProductToCart(${Number(id)})"
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


  document.body.appendChild(
    modal
  );
}


/* =========================================================
   CHANGE GALLERY IMAGE
========================================================= */

function changeGalleryImage(
  productId,
  index
) {

  const product =
    products.find(
      function(item) {

        return (
          Number(item.id) ===
          Number(productId)
        );

      }
    );


  if (!product) return;


  const images =
    getProductImages(
      product
    );


  if (!images[index]) return;


  const main =
    document.getElementById(
      "galleryMainImage"
    );


  if (main) {

    main.src =
      images[index];

  }


  document
    .querySelectorAll(
      "#galleryThumbs button"
    )
    .forEach(
      function(button, i) {

        button.style.borderColor =
          i === index
            ? "#c9a96e"
            : "#3b3633";

      }
    );
}


/* =========================================================
   SELECT OPTION
========================================================= */

function selectProductOption(
  button
) {

  if (!button) return;


  const parent =
    button.parentElement;


  parent
    .querySelectorAll(
      ".option-btn"
    )
    .forEach(
      function(item) {

        item.classList.remove(
          "selected"
        );

        item.style.background =
          "transparent";

        item.style.color =
          "#fff";

      }
    );


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

function getSelectedOption(
  containerId
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) return "";


  const selected =
    container.querySelector(
      ".option-btn.selected"
    );


  return selected
    ? selected.getAttribute(
        "data-value"
      ) || ""
    : "";
}


/* =========================================================
   DETAILS QUANTITY
========================================================= */

function changeDetailsQty(
  change
) {

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
   ADD PRODUCT FROM DETAILS
========================================================= */

function addDetailsProductToCart(
  id
) {

  const product =
    products.find(
      function(item) {

        return (
          Number(item.id) ===
          Number(id)
        );

      }
    );


  if (!product) return;


  const colors =
    normalizeArray(
      product.colors
    );


  const sizes =
    normalizeArray(
      product.sizes
    );


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
    cart.find(
      function(item) {

        return (
          Number(item.id) ===
            Number(product.id) &&
          item.color === color &&
          item.size === size
        );

      }
    );


  if (existing) {

    existing.qty += quantity;

  } else {

    cart.push({

      id:
        product.id,

      name:
        product.name,

      category:
        product.category,

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
    products.find(
      function(item) {

        return (
          Number(item.id) ===
          Number(id)
        );

      }
    );


  if (!product) return;


  const colors =
    normalizeArray(
      product.colors
    );


  const sizes =
    normalizeArray(
      product.sizes
    );


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
    cart.reduce(
      function(sum, item) {

        return sum + item.qty;

      },
      0
    );


  const totalPrice =
    cart.reduce(
      function(sum, item) {

        return (
          sum +
          Number(item.price || 0) *
          item.qty
        );

      },
      0
    );


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
    cart.map(
      function(item, index) {

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
                      اللون:
                      ${escapeHTML(item.color)}
                    </span>
                  `
                  : ""
              }


              ${
                item.size
                  ? `
                    <span>
                      المقاس:
                      ${escapeHTML(item.size)}
                    </span>
                  `
                  : ""
              }


              <span class="cat">
                ${Number(item.price)}
                جنيه للقطعة
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

      }
    ).join("");
}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeQty(
  index,
  change
) {

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
   CART
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
   CHECKOUT
========================================================= */

function checkout() {

  if (!cart.length) {

    alert(
      "السلة فارغة"
    );

    return;
  }


  const name =
    document
      .getElementById(
        "customerName"
      )
      .value
      .trim();


  const phone =
    document
      .getElementById(
        "customerPhone"
      )
      .value
      .trim();


  const governorate =
    document
      .getElementById(
        "customerGovernorate"
      )
      .value
      .trim();


  const address =
    document
      .getElementById(
        "customerAddress"
      )
      .value
      .trim();


  const error =
    document.getElementById(
      "customerFormError"
    );


  if (
    !name ||
    !phone ||
    !governorate ||
    !address
  ) {

    if (error) {

      error.textContent =
        "من فضلك املأ جميع بيانات التوصيل.";

      error.classList.add(
        "show"
      );

    }

    return;
  }


  if (error) {

    error.textContent = "";

    error.classList.remove(
      "show"
    );

  }


  const lines =
    cart.map(
      function(item) {

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

      }
    ).join("\n");


  const total =
    cart.reduce(
      function(sum, item) {

        return (
          sum +
          Number(item.price) *
          item.qty
        );

      },
      0
    );


  const message =
    "مرحبًا VELORA، أريد تأكيد الطلب:\n\n" +

    lines +

    "\n\nالإجمالي: " +
    total +
    " جنيه\n\n" +

    "بيانات العميل:\n" +

    "الاسم: " +
    name +
    "\n" +

    "رقم الهاتف: " +
    phone +
    "\n" +

    "المحافظة: " +
    governorate +
    "\n" +

    "العنوان: " +
    address;


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
   ESCAPE
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
        .forEach(
          function(modal) {

            modal.remove();

          }
        );

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
