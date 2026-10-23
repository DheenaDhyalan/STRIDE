const products = [
  {id:1,name:"Velocity Runner",category:"Running",price:3499,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",colors:["#ef4b2d","#292b28","#e6e3d9"]},
  {id:2,name:"Cloudform Low",category:"Lifestyle",price:2899,tag:"NEW DROP",image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",colors:["#e9e5dc","#252622","#b9c7b0"]},
  {id:3,name:"Streetline 90",category:"Skate",price:3199,tag:"",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=85",colors:["#e8e4dc","#d54a34","#30312e"]},
  {id:4,name:"Everyday Form",category:"Lifestyle",price:2599,tag:"EASY EVERYDAY",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=85",colors:["#f2eee4","#22231f"]},
  {id:5,name:"Pace Pro Knit",category:"Running",price:4299,tag:"PERFORMANCE",image:"https://images.unsplash.com/photo-1460353581641-37baddi?auto=format&fit=crop&w=800&q=85",colors:["#292b28","#d84d35","#deded4"]},
  {id:6,name:"Retro Court",category:"Lifestyle",price:2999,tag:"",image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=85",colors:["#e9e5dc","#2b2c28","#c3b8a8"]}
];

const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const state = {filter:"All",search:"",sort:"featured",cart:[]};
const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
let toastTimer;

function renderProducts(){
  let visible = products.filter(p => (state.filter==="All" || p.category===state.filter) && p.name.toLowerCase().includes(state.search.toLowerCase()));
  if(state.sort==="low") visible.sort((a,b)=>a.price-b.price);
  if(state.sort==="high") visible.sort((a,b)=>b.price-a.price);
  grid.innerHTML = visible.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <img class="product-image" src="${p.image}" alt="${p.name} sneaker" loading="lazy" onerror="this.style.opacity='.25'">
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><span class="product-category">${p.category}</span></div><span class="product-price">${money(p.price)}</span></div>
      <div class="product-colors" aria-label="Available colors">${p.colors.map(c=>`<span class="color-dot" style="background:${c}"></span>`).join("")}</div>
    </article>`).join("");
  emptyState.hidden = visible.length>0;
}
function showToast(message){
  toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function addToCart(id){
  const item=state.cart.find(x=>x.id===id);
  if(item)item.qty++;else state.cart.push({id,qty:1});
  renderCart();showToast("Added to your bag ✳");
}
function changeQty(id,delta){
  const item=state.cart.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);
  renderCart();
}
function renderCart(){
  const count=state.cart.reduce((s,x)=>s+x.qty,0);
  const subtotal=state.cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerCount").textContent=`(${count})`;
  document.getElementById("cartSubtotal").textContent=money(subtotal);
  document.getElementById("cartItems").innerHTML=state.cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-row"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Remove one">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Add one">+</button></div></div><span class="row-price">${money(p.price*item.qty)}</span></div>`;
  }).join("");
  const isEmpty=count===0;
  document.getElementById("cartEmpty").style.display=isEmpty?"block":"none";
  document.getElementById("cartFooter").style.display=isEmpty?"none":"block";
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
  const qty=e.target.closest("[data-qty]");if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  const filterLink=e.target.closest("[data-filter-link]");if(filterLink){state.filter=filterLink.dataset.filterLink;updateFilters();document.getElementById("navLinks").classList.remove("open");}
});
document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  state.filter=btn.dataset.filter;updateFilters();
}));
function updateFilters(){document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.filter===state.filter));renderProducts();}
document.getElementById("sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderProducts();});
document.getElementById("searchToggle").addEventListener("click",()=>{
  const wrap=document.getElementById("searchWrap");wrap.classList.toggle("open");
  if(wrap.classList.contains("open"))document.getElementById("searchInput").focus();
});
document.getElementById("searchInput").addEventListener("input",e=>{state.search=e.target.value;renderProducts();});
document.getElementById("closeSearch").addEventListener("click",()=>{document.getElementById("searchWrap").classList.remove("open");document.getElementById("searchInput").value="";state.search="";renderProducts();});
document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
document.getElementById("keepShopping").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast("Demo store: checkout isn't connected yet."));
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("navLinks");const open=nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
document.getElementById("newsletterForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const email=document.getElementById("newsletterEmail").value.trim();
  const msg=document.getElementById("formMessage");
  // Optional Supabase signup insert; without Supabase configured, show a local demo message.
  if(window.STRIDE_SUPABASE_URL && window.STRIDE_SUPABASE_ANON_KEY && window.supabase){
    try{
      const client=window.supabase.createClient(window.STRIDE_SUPABASE_URL,window.STRIDE_SUPABASE_ANON_KEY);
      const {error}=await client.from("newsletter_subscribers").insert([{email}]);
      if(error)throw error;
      msg.textContent="You're on the list. See you out there!";e.target.reset();
    }catch(err){msg.textContent="Couldn't save just now. Please try again later.";console.error(err);}
  }else{
    msg.textContent="Thanks! Demo mode is on — connect Supabase to save subscriptions.";
    e.target.reset();
  }
});
renderProducts();renderCart();
