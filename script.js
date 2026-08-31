const WHATSAPP = "201223562957";

const SUPABASE_URL = "https://nflcafxxjhinumvxyyxt.supabase.co";
const SUPABASE_KEY = "ضع هنا نفس Publishable Key الموجود في admin.html";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let products = [];
let cart = [];
let activeCategory = "الكل";

async function loadProducts() {
  const grid = document.getElementById("productGrid");

  if (grid) {
    grid.innerHTML = "<p>جاري تحميل المنتجات...</p>";
  }

  const result = await supabaseClient
    .from("Velora")
    .select("*")
    .order("id", { ascending: false });

  if (result.error) {
    console.error("Supabase Error:", result.error);

    if (grid) {
      grid.innerHTML =
        "<div class=\"empty-products\">" +
        "<h3>تعذر تحميل المنتجات</h3>" +
        "<p>حدث خطأ أثناء الاتصال بقاعدة البيانات.</p>" +
        "</div>";
    }

    return;
  }

  products = result.data || [];

  renderProducts();
}

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

    const name = String(product.name || "").toLowerCase();
    const description =
      String(product.description || "").toLowerCase();

    const searchMatch =
      name.includes(query) ||
      description.includes(query);

    return categoryMatch && searchMatch;
  });

  if (!filtered.length) {
    grid.innerHTML =
      "<div class=\"empty-products\">" +
      "<div>✦</div>" +
      "<h3>لا توجد منتجات</h3>" +
      "<p>سيتم إضافة المنتجات قريبًا.</p>" +
      "</div>";

    return;
  }

  grid.innerHTML = filtered.map(function(product) {
    return (
      "<article class=\"product\">" +

        "<div class=\"product-img\" onclick=\"openProduct(" +
        product.id +
        ")\">" +

          "<span class=\"product-badge\">مميز</span>" +

          "<button class=\"favorite-btn\" type=\"button\" " +
          "onclick=\"event.stopPropagation(); toggleFavorite(this)\">" +
          "♡" +
          "</button>" +

          "<img src=\"" +
          (product.image || "") +
          "\" alt=\"" +
          String(product.name || "") +
          "\" loading=\"lazy\">" +

        "</div>" +

        "<div class=\"product-info\">" +

          "<div class=\"product-top\">" +

            "<span class=\"cat\">" +
            String(product.category || "") +
            "</span>" +

            "<span class=\"rating\">★★★★★</span>" +

          "</div>" +

          "<h3>" +
          String(product.name || "") +
          "</h3>" +

          "<p class=\"product-desc\">" +
          String(product.description || "") +
          "</p>" +

          "<div class=\"product-bottom\">" +

            "<div class=\"product-price\">" +
              "<strong>" +
              Number(product.price || 0) +
              "</strong>" +
              "<span> جنيه</span>" +
            "</div>" +

            "<button class=\"add-btn\" type=\"button\" " +
            "onclick=\"addToCart(" +
            product.id +
            ")\">" +
            "أضف للسلة <span>+</span>" +
            "</button>" +

          "</div>" +

        "</div>" +

      "</article>"
    );
  }).join("");
}

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

function toggleFavorite(button) {
  button.classList.toggle("active");

  button.textContent =
    button.classList.contains("active")
      ? "♥"
      : "♡";
}

function openProduct(id) {
  const product = products.find(function(item) {
    return Number(item.id) === Number(id);
  });

  if (!product) return;

  const modal = document.createElement("div");

  modal.className = "modal product-details-modal";

  modal.innerHTML =
    "<div class=\"modal-overlay\" onclick=\"this.parentElement.remove()\"></div>" +

    "<div class=\"modal-box product-details-box\">" +

      "<button class=\"close\" type=\"button\" " +
      "onclick=\"this.closest('.modal').remove()\">×</button>" +

      "<div class=\"product-details-image\">" +
        "<img src=\"" +
        (product.image || "") +
        "\" alt=\"" +
        String(product.name || "") +
        "\">" +
      "</div>" +

      "<div class=\"product-details-content\">" +

        "<span class=\"cat\">" +
        String(product.category || "") +
        "</span>" +

        "<h2>" +
        String(product.name || "") +
        "</h2>" +

        "<div class=\"rating\">★★★★★</div>" +

        "<div class=\"details-price\">" +
        Number(product.price || 0) +
        " جنيه</div>" +

        "<p>" +
        String(product.description || "") +
        "</p>" +

        "<button class=\"primary full\" type=\"button\" " +
        "onclick=\"addToCart(" +
        product.id +
        "); this.closest('.modal').remove()\">" +
        "أضف للسلة" +
        "</button>" +

      "</div>" +

    "</div>";

  document.body.appendChild(modal);
}

function addToCart(id) {
  const product = products.find(function(item) {
    return Number(item.id) === Number(id);
  });

  if (!product) return;

  const existing = cart.find(function(item) {
    return Number(item.id) === Number(id);
  });

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price || 0),
      qty: 1
    });
  }

  updateCart();
  openCart();
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const totalQuantity = cart.reduce(function(sum, item) {
    return sum + item.qty;
  }, 0);

  const totalPrice = cart.reduce(function(sum, item) {
    return sum + Number(item.price) * item.qty;
  }, 0);

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }

  if (cartTotal) {
    cartTotal.textContent = totalPrice;
  }

  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML =
      "<div class=\"cart-empty\">" +
      "<div>🛍️</div>" +
      "<h3>السلة فارغة</h3>" +
      "<p>أضيفي بعض القطع الجميلة للبدء.</p>" +
      "</div>";

    return;
  }

  cartItems.innerHTML = cart.map(function(item) {
    return (
      "<div class=\"cart-line\">" +

        "<div class=\"cart-product\">" +
          "<strong>" +
          item.name +
          "</strong>" +

          "<span class=\"cat\">" +
          item.price +
          " جنيه للقطعة</span>" +

        "</div>" +

        "<div class=\"quantity\">" +

          "<button type=\"button\" " +
          "onclick=\"changeQty(" +
          item.id +
          ", -1)\">−</button>" +

          "<b>" +
          item.qty +
          "</b>" +

          "<button type=\"button\" " +
          "onclick=\"changeQty(" +
          item.id +
          ", 1)\">+</button>" +

        "</div>" +

        "<strong class=\"cart-price\">" +
        Number(item.price) * item.qty +
        " جنيه</strong>" +

      "</div>"
    );
  }).join("");
}

function changeQty(id, change) {
  const item = cart.find(function(product) {
    return Number(product.id) === Number(id);
  });

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(function(product) {
      return Number(product.id) !== Number(id);
    });
  }

  updateCart();
}

function openCart() {
  const modal = document.getElementById("cartModal");

  if (!modal) return;

  modal.classList.remove("hidden");
  updateCart();
}

function closeCart() {
  const modal = document.getElementById("cartModal");

  if (!modal) return;

  modal.classList.add("hidden");
}

function checkout() {
  if (!cart.length) {
    alert("السلة فارغة");
    return;
  }

  const lines = cart.map(function(item) {
    return (
      "• " +
      item.name +
      " × " +
      item.qty +
      " — " +
      Number(item.price) * item.qty +
      " جنيه"
    );
  }).join("\n");

  const total = cart.reduce(function(sum, item) {
    return sum + Number(item.price) * item.qty;
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

function toggleMenu() {
  const nav = document.getElementById("mainNav");

  if (!nav) return;

  nav.classList.toggle("mobile-open");
}

document.addEventListener("click", function(event) {
  if (event.target.closest("nav a")) {
    const nav = document.getElementById("mainNav");

    if (nav) {
      nav.classList.remove("mobile-open");
    }
  }
});

document.addEventListener("input", function(event) {
  if (event.target.id === "search") {
    renderProducts();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  updateCart();
  loadProducts();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeCart();
  }
});
