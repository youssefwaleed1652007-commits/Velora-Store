const WHATSAPP = "201223562957";

/* =========================
PRODUCTS
========================= */

const products = [

{
id: 1,
name: "خاتم أوراق",
category: "خواتم",
price: 280,
icon: "💍",
image: "",
description: "خاتم بتصميم أوراق أنيق مناسب للإطلالات اليومية والمناسبات.",
colors: ["ذهبي", "فضي"],
sizes: ["6", "7", "8"]
},

{
id: 2,
name: "سلسلة فاني كليف",
category: "سلاسل",
price: 320,
icon: "📿",
image: "",
description: "سلسلة أنيقة بتصميم مستوحى من الزهور لإطلالة راقية.",
colors: ["ذهبي", "فضي"],
sizes: []
},

{
id: 3,
name: "أسوار فاني كليف",
category: "أساور",
price: 350,
icon: "✨",
image: "",
description: "أسورة ناعمة وأنيقة تضيف لمسة مميزة لإطلالتك.",
colors: ["ذهبي", "فضي"],
sizes: ["صغير", "متوسط", "كبير"]
},

{
id: 4,
name: "حلق دائري فخم",
category: "حلق",
price: 300,
icon: "💎",
image: "",
description: "حلق دائري بتصميم بسيط وفخم مناسب للمناسبات.",
colors: ["ذهبي", "فضي"],
sizes: []
},

{
id: 5,
name: "خاتم ناعم",
category: "خواتم",
price: 240,
icon: "💍",
image: "",
description: "خاتم ناعم وبسيط للاستخدام اليومي.",
colors: ["ذهبي", "فضي"],
sizes: ["6", "7", "8"]
},

{
id: 6,
name: "سلسلة نجمة",
category: "سلاسل",
price: 290,
icon: "📿",
image: "",
description: "سلسلة بتصميم نجمة ناعم تضيف لمسة مميزة.",
colors: ["ذهبي", "فضي"],
sizes: []
},

{
id: 7,
name: "أسورة رفيعة",
category: "أساور",
price: 260,
icon: "✨",
image: "",
description: "أسورة رفيعة بتصميم بسيط وأنيق.",
colors: ["ذهبي", "فضي"],
sizes: ["صغير", "متوسط", "كبير"]
},

{
id: 8,
name: "حلق لؤلؤ",
category: "حلق",
price: 330,
icon: "💎",
image: "",
description: "حلق بتفاصيل مستوحاة من اللؤلؤ لإطلالة أنيقة.",
colors: ["ذهبي", "فضي"],
sizes: []
}

];

let activeCategory = "الكل";
let cart = [];

/* =========================
RENDER PRODUCTS
========================= */

function renderProducts(){

const searchInput = document.getElementById("search");

const q = searchInput
? searchInput.value.trim().toLowerCase()
: "";

const list = products.filter(product =>

```
(activeCategory === "الكل" ||
  product.category === activeCategory)

&&

product.name.toLowerCase().includes(q)
```

);

const grid = document.getElementById("productGrid");

if(!grid) return;

if(!list.length){

```
grid.innerHTML = `
  <div style="grid-column:1/-1;text-align:center;padding:50px 20px;">
    <div style="font-size:45px;">✦</div>
    <h3>لم نجد هذا المنتج</h3>
    <p style="color:#777;">
      جربي البحث باسم مختلف.
    </p>
  </div>
`;

return;
```

}

grid.innerHTML = list.map(product => `

```
<article class="product">

  <div
    class="product-img"
    onclick="openProduct(${product.id})"
    style="cursor:pointer;"
  >

  ${
  product.image
    ? `<img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >`
    : `<div class="product-placeholder">${product.icon}</div>`
}

  </div>


  <div class="product-info">

    <span class="cat">
      ${product.category}
    </span>

    <h3>
      ${product.name}
    </h3>

    <div class="price">
      ${product.price} جنيه
    </div>

    <button onclick="addToCart(${product.id})">
      أضف للسلة
    </button>

  </div>

</article>
```

`).join("");

}

/* =========================
FILTER
========================= */

function filterProducts(category){

activeCategory = category;

renderProducts();

const productsSection =
document.getElementById("products");

if(productsSection){

```
productsSection.scrollIntoView({
  behavior:"smooth"
});
```

}

}

/* =========================
PRODUCT DETAILS
========================= */

function openProduct(id){

const product =
products.find(item => item.id === id);

if(!product) return;

const colors = product.colors.length

```
? `
  <div style="margin-top:18px;">

    <strong>اللون</strong>

    <div style="
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    ">

      ${product.colors.map((color,index) => `

        <button
          onclick="selectOption(this)"
          class="option-btn ${index === 0 ? "selected" : ""}"
          data-value="${color}"
          style="
            padding:9px 16px;
            border:1px solid #e0d4cc;
            border-radius:20px;
            background:${index === 0 ? "#211f1e" : "#fff"};
            color:${index === 0 ? "#fff" : "#302a27"};
            cursor:pointer;
          "
        >
          ${color}
        </button>

      `).join("")}

    </div>

  </div>
`

: "";
```

const sizes = product.sizes.length

```
? `
  <div style="margin-top:18px;">

    <strong>المقاس</strong>

    <div style="
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    ">

      ${product.sizes.map((size,index) => `

        <button
          onclick="selectOption(this)"
          class="option-btn ${index === 0 ? "selected" : ""}"
          data-value="${size}"
          style="
            padding:9px 16px;
            border:1px solid #e0d4cc;
            border-radius:20px;
            background:${index === 0 ? "#211f1e" : "#fff"};
            color:${index === 0 ? "#fff" : "#302a27"};
            cursor:pointer;
          "
        >
          ${size}
        </button>

      `).join("")}

    </div>

  </div>
`

: "";
```

const modal = document.createElement("div");

modal.className = "modal product-details-modal";

modal.innerHTML = `

```
<div
  class="modal-overlay"
  onclick="this.parentElement.remove()"
></div>

<div class="modal-box">

  <button
    class="close"
    onclick="this.closest('.modal').remove()"
  >
    ×
  </button>


  <div style="
    text-align:center;
    padding:15px 0 5px;
  ">

    <div style="
      font-size:85px;
      margin-bottom:10px;
    ">
      ${product.image
        ? `<img
            src="${product.image}"
            alt="${product.name}"
            style="
              width:100%;
              max-height:300px;
              object-fit:cover;
              border-radius:15px;
            "
          >`
        : product.icon
      }
    </div>


    <span class="cat">
      ${product.category}
    </span>


    <h2 style="
      margin:8px 0;
      font-family:'Playfair Display',serif;
    ">
      ${product.name}
    </h2>


    <div style="
      font-size:22px;
      font-weight:700;
      color:#a66e67;
    ">
      ${product.price} جنيه
    </div>


    <p style="
      color:#777;
      line-height:1.9;
      font-size:14px;
    ">
      ${product.description}
    </p>


    ${colors}
    ${sizes}


    <button
      class="primary full"
      style="margin-top:25px;"
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
SELECT OPTION
========================= */

function selectOption(button){

const parent = button.parentElement;

parent
.querySelectorAll(".option-btn")
.forEach(btn => {

```
  btn.classList.remove("selected");

  btn.style.background = "#fff";
  btn.style.color = "#302a27";

});
```

button.classList.add("selected");

button.style.background = "#211f1e";
button.style.color = "#fff";

}

/* =========================
ADD TO CART
========================= */

function addToCart(id){

const existing =
cart.find(item => item.id === id);

if(existing){

```
existing.qty++;
```

}else{

```
const product =
  products.find(item => item.id === id);

if(!product) return;


cart.push({
  ...product,
  qty:1
});
```

}

updateCart();

openCart();

}

/* =========================
UPDATE CART
========================= */

function updateCart(){

const totalQuantity =
cart.reduce(
(sum,item) => sum + item.qty,
0
);

const cartCount =
document.getElementById("cartCount");

if(cartCount){

```
cartCount.textContent =
  totalQuantity;
```

}

const box =
document.getElementById("cartItems");

if(!box) return;

if(!cart.length){

```
box.innerHTML = `
  <div style="
    text-align:center;
    padding:35px 10px;
  ">

    <div style="font-size:45px;">
      🛍️
    </div>

    <h3>
      السلة فارغة
    </h3>

    <p style="color:#777;">
      ابدئي بإضافة بعض القطع الجميلة.
    </p>

  </div>
`;
```

}else{

```
box.innerHTML = cart.map(item => `

  <div class="cart-line">

    <div style="flex:1;">

      <strong>
        ${item.name}
      </strong>

      <div class="cat">
        ${item.price} جنيه للقطعة
      </div>

    </div>


    <div class="quantity">

      <button
        onclick="changeQty(${item.id},-1)"
      >
        −
      </button>

      <b>
        ${item.qty}
      </b>

      <button
        onclick="changeQty(${item.id},1)"
      >
        +
      </button>

    </div>


    <strong>
      ${item.price * item.qty} جنيه
    </strong>

  </div>

`).join("");
```

}

const total =
cart.reduce(
(sum,item) =>
sum + (item.price * item.qty),
0
);

const totalElement =
document.getElementById("cartTotal");

if(totalElement){

```
totalElement.textContent = total;
```

}

}

/* =========================
CHANGE QUANTITY
========================= */

function changeQty(id,change){

const item =
cart.find(product => product.id === id);

if(!item) return;

item.qty += change;

if(item.qty <= 0){

```
cart =
  cart.filter(
    product => product.id !== id
  );
```

}

updateCart();

}

/* =========================
CART
========================= */

function openCart(){

const modal =
document.getElementById("cartModal");

if(!modal) return;

modal.classList.remove("hidden");

updateCart();

}

function closeCart(){

const modal =
document.getElementById("cartModal");

if(!modal) return;

modal.classList.add("hidden");

}

/* =========================
CHECKOUT
========================= */

function checkout(){

if(!cart.length){

```
alert("السلة فارغة");

return;
```

}

const lines =
cart.map(item =>

```
  `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`

).join("\n");
```

const total =
cart.reduce(
(sum,item) =>
sum + (item.price * item.qty),
0
);

const msg =
`مرحبًا VELORA، أريد طلب:

${lines}

الإجمالي: ${total} جنيه

الاسم:
العنوان:
رقم الهاتف:`;

window.open(
`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
"_blank"
);

}

/* =========================
MOBILE MENU
========================= */

function toggleMenu(){

const nav =
document.getElementById("mainNav");

if(!nav) return;

nav.classList.toggle("mobile-open");

}

/* =========================
CLOSE MENU AFTER CLICK
========================= */

document.addEventListener("click",function(event){

const nav =
document.getElementById("mainNav");

if(!nav) return;

if(event.target.closest("nav a")){

```
nav.classList.remove("mobile-open");
```

}

});

/* =========================
WHATSAPP LINK
========================= */

const whatsappLink =
document.getElementById("whatsappLink");

if(whatsappLink){

whatsappLink.href =
`https://wa.me/${WHATSAPP}`;

}

/* =========================
ESCAPE KEY
========================= */

document.addEventListener("keydown",function(event){

if(event.key === "Escape"){

```
closeCart();
```

}

});

/* =========================
START
========================= */

renderProducts();
updateCart();
