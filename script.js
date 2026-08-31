```javascript
const WHATSAPP = "201223562957";

let cart = [];
let activeCategory = "الكل";

const products = [
  {
    id: 1,
    name: "خاتم أوراق",
    category: "خواتم",
    price: 280,
    image: "product-1.jpeg",
    description: "خاتم أنيق بتصميم أوراق."
  },
  {
    id: 2,
    name: "سلسلة فاني كليف",
    category: "سلاسل",
    price: 320,
    image: "product-2.jpeg",
    description: "سلسلة أنيقة ومميزة."
  },
  {
    id: 3,
    name: "أسورة فاني كليف",
    category: "أساور",
    price: 350,
    image: "product-3.jpeg",
    description: "أسورة أنيقة بتصميم راقٍ."
  },
  {
    id: 4,
    name: "حلق دائري فخم",
    category: "حلق",
    price: 300,
    image: "product-4.jpeg",
    description: "حلق دائري بتصميم فخم."
  },
  {
    id: 5,
    name: "خاتم ناعم",
    category: "خواتم",
    price: 240,
    image: "product-5.jpeg",
    description: "خاتم ناعم وبسيط."
  },
  {
    id: 6,
    name: "سلسلة نجمة",
    category: "سلاسل",
    price: 290,
    image: "product-6.jpeg",
    description: "سلسلة بتصميم نجمة."
  },
  {
    id: 7,
    name: "أسورة رفيعة",
    category: "أساور",
    price: 260,
    image: "product-7.jpeg",
    description: "أسورة رفيعة وأنيقة."
  },
  {
    id: 8,
    name: "حلق لؤلؤ",
    category: "حلق",
    price: 330,
    image: "product-8.jpeg",
    description: "حلق بتفاصيل لؤلؤية."
  }
];

function renderProducts() {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  const search = document.getElementById("search");

  const query = search
    ? search.value.trim().toLowerCase()
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
    grid.innerHTML =
      '<div class="empty-products">' +
      '<div>✦</div>' +
      '<h3>لم نجد هذا المنتج</h3>' +
      '<p>جربي البحث باسم مختلف.</p>' +
      '</div>';

    return;
  }

  grid.innerHTML = filtered.map(function(product) {
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
          product.image +
          '" alt="' +
          product.name +
          '" loading="lazy">' +

        '</div>' +

        '<div class="product-info">' +

          '<div class="product-top">' +

            '<span class="cat">' +
            product.category +
            '</span>' +

            '<span class="rating">★★★★★</span>' +

          '</div>' +

          '<h3>' +
          product.name +
          '</h3>' +

          '<p class="product-desc">' +
          product.description +
          '</p>' +

          '<div class="product-bottom">' +

            '<div class="product-price">' +
              '<strong>' +
              product.price +
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
    return item.id === id;
  });

  if (!product) return;

  const modal = document.createElement("div");

  modal.className = "modal product-details-modal";

  modal.innerHTML =
    '<div class="modal-overlay" onclick="this.parentElement.remove()"></div>' +

    '<div class="modal-box product-details-box">' +

      '<button class="close" type="button" ' +
      'onclick="this.closest(\'.modal\').remove()">×</button>' +

      '<div class="product-details-image">' +
        '<img src="' +
        product.image +
        '" alt="' +
        product.name +
        '">' +
      '</div>' +

      '<div class="product-details-content">' +

        '<span class="cat">' +
        product.category +
        '</span>' +

        '<h2>' +
        product.name +
        '</h2>' +

        '<div class="rating">★★★★★</div>' +

        '<div class="details-price">' +
        product.price +
        ' جنيه</div>' +

        '<p>' +
        product.description +
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

function changeDetailsQty(change) {
  const element = document.getElementById("detailsQty");

  if (!element) return;

  let quantity = parseInt(element.textContent) || 1;

  quantity += change;

  if (quantity < 1) {
    quantity = 1;
  }

  element.textContent = quantity;
}

function addToCart(id) {
  const product = products.find(function(item) {
    return item.id === id;
  });

  if (!product) return;

  const existing = cart.find(function(item) {
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

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const totalQuantity = cart.reduce(function(sum, item) {
    return sum + item.qty;
  }, 0);

  const totalPrice = cart.reduce(function(sum, item) {
    return sum + item.price * item.qty;
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
      '<div class="cart-empty">' +
      '<div>🛍️</div>' +
      '<h3>السلة فارغة</h3>' +
      '<p>أضيفي بعض القطع الجميلة للبدء.</p>' +
      '</div>';

    return;
  }

  cartItems.innerHTML = cart.map(function(item) {
    return (
      '<div class="cart-line">' +

        '<div class="cart-product">' +
          '<strong>' +
          item.name +
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
        item.price * item.qty +
        ' جنيه</strong>' +

      '</div>'
    );
  }).join("");
}

function changeQty(id, change) {
  const item = cart.find(function(product) {
    return product.id === id;
  });

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(function(product) {
      return product.id !== id;
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
      item.price * item.qty +
      " جنيه"
    );
  }).join("\n");

  const total = cart.reduce(function(sum, item) {
    return sum + item.price * item.qty;
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
  renderProducts();
  updateCart();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeCart();
  }
});
```
