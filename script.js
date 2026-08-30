// غيّر رقم واتساب هنا إلى رقم المحل/الرقم الذي يستقبل الطلبات.
// اكتب الرقم دولي بدون + أو مسافات، مثال مصر: 2010XXXXXXXX
const WHATSAPP = "201112989746";

const products = [
  {id:1,name:"خاتم أوراق",category:"خواتم",price:280,icon:"💍"},
  {id:2,name:"سلسلة فاني كليف",category:"سلاسل",price:320,icon:"📿"},
  {id:3,name:"أسوار فاني كليف",category:"أساور",price:350,icon:"✨"},
  {id:4,name:"حلق دائري فخم",category:"حلق",price:300,icon:"💎"},
  {id:5,name:"خاتم ناعم",category:"خواتم",price:240,icon:"💍"},
  {id:6,name:"سلسلة نجمة",category:"سلاسل",price:290,icon:"📿"},
  {id:7,name:"أسوار رفيع",category:"أساور",price:260,icon:"✨"},
  {id:8,name:"حلق لؤلؤ",category:"حلق",price:330,icon:"💎"}
];

let activeCategory = "الكل";
let cart = [];

function renderProducts(){
  const q = document.getElementById("search").value.trim().toLowerCase();
  const list = products.filter(p =>
    (activeCategory==="الكل" || p.category===activeCategory) &&
    p.name.toLowerCase().includes(q)
  );
  document.getElementById("productGrid").innerHTML = list.map(p => `
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-info">
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price">${p.price} جنيه</div>
        <button onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </article>`).join("");
}
function filterProducts(cat){activeCategory=cat;renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});}
function addToCart(id){const p=products.find(x=>x.id===id);cart.push(p);updateCart();openCart();}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.length;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML="<p>السلة فارغة.</p>";}
  else box.innerHTML=cart.map((p,i)=>`<div class="cart-line"><span>${p.name}</span><b>${p.price} جنيه <button onclick="removeItem(${i})">×</button></b></div>`).join("");
  document.getElementById("cartTotal").textContent=cart.reduce((s,p)=>s+p.price,0);
}
function removeItem(i){cart.splice(i,1);updateCart();}
function openCart(){document.getElementById("cartModal").classList.remove("hidden");updateCart();}
function closeCart(){document.getElementById("cartModal").classList.add("hidden");}
function checkout(){
  if(!cart.length){alert("السلة فارغة");return;}
  const lines=cart.map(p=>`• ${p.name} — ${p.price} جنيه`).join("\n");
  const total=cart.reduce((s,p)=>s+p.price,0);
  const msg=`مرحبًا VELORA، أريد طلب:\n${lines}\n\nالإجمالي: ${total} جنيه\nالاسم:\nالعنوان:\nرقم الهاتف:`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
}
document.getElementById("whatsappLink").href=`https://wa.me/${WHATSAPP}`;
renderProducts();
