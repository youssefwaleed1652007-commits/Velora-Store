const WHATSAPP = "201223562957";

const products = [
  {id:1,name:"خاتم أوراق",category:"خواتم",price:280,icon:"💍",image:""},
  {id:2,name:"سلسلة فاني كليف",category:"سلاسل",price:320,icon:"📿",image:""},
  {id:3,name:"أسوار فاني كليف",category:"أساور",price:350,icon:"✨",image:""},
  {id:4,name:"حلق دائري فخم",category:"حلق",price:300,icon:"💎",image:""},
  {id:5,name:"خاتم ناعم",category:"خواتم",price:240,icon:"💍",image:""},
  {id:6,name:"سلسلة نجمة",category:"سلاسل",price:290,icon:"📿",image:""},
  {id:7,name:"أسوار رفيع",category:"أساور",price:260,icon:"✨",image:""},
  {id:8,name:"حلق لؤلؤ",category:"حلق",price:330,icon:"💎",image:""}
];

let activeCategory = "الكل";
let cart = [];

function renderProducts(){
  const q = document.getElementById("search").value.trim().toLowerCase();

  const list = products.filter(p =>
    (activeCategory === "الكل" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(q)
  );

  document.getElementById("productGrid").innerHTML = list.map(p => `
    <article class="product">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.icon}
      </div>

      <div class="product-info">
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price">${p.price} جنيه</div>

        <button onclick="addToCart(${p.id})">
          أضف للسلة
        </button>
      </div>
    </article>
  `).join("");
}

function filterProducts(cat){
  activeCategory = cat;
  renderProducts();

  document.getElementById("products").scrollIntoView({
    behavior:"smooth"
  });
}

function addToCart(id){
  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.qty++;
  }else{
    const product = products.find(p => p.id === id);

    cart.push({
      ...product,
      qty:1
    });
  }

  updateCart();
  openCart();
}

function updateCart(){

  const totalQuantity = cart.reduce(
    (sum,item) => sum + item.qty,
    0
  );

  document.getElementById("cartCount").textContent = totalQuantity;

  const box = document.getElementById("cartItems");

  if(!cart.length){

    box.innerHTML = "<p>السلة فارغة.</p>";

  }else{

    box.innerHTML = cart.map(item => `

      <div class="cart-line">

        <div>
          <strong>${item.name}</strong>
          <div class="cat">${item.price} جنيه للقطعة</div>
        </div>

        <div class="quantity">

          <button onclick="changeQty(${item.id},-1)">
            −
          </button>

          <b>${item.qty}</b>

          <button onclick="changeQty(${item.id},1)">
            +
          </button>

        </div>

        <strong>
          ${item.price * item.qty} جنيه
        </strong>

      </div>

    `).join("");
  }

  const total = cart.reduce(
    (sum,item) => sum + (item.price * item.qty),
    0
  );

  document.getElementById("cartTotal").textContent = total;
}

function changeQty(id,change){

  const item = cart.find(product => product.id === id);

  if(!item) return;

  item.qty += change;

  if(item.qty <= 0){
    cart = cart.filter(product => product.id !== id);
  }

  updateCart();
}

function openCart(){
  document.getElementById("cartModal").classList.remove("hidden");
  updateCart();
}

function closeCart(){
  document.getElementById("cartModal").classList.add("hidden");
}

function checkout(){

  if(!cart.length){
    alert("السلة فارغة");
    return;
  }

  const lines = cart.map(item =>
    `• ${item.name} × ${item.qty} — ${item.price * item.qty} جنيه`
  ).join("\n");

  const total = cart.reduce(
    (sum,item) => sum + (item.price * item.qty),
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

const whatsappLink = document.getElementById("whatsappLink");

if(whatsappLink){
  whatsappLink.href = `https://wa.me/${WHATSAPP}`;
}

renderProducts();
