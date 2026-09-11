const USERS_KEY="joservicing_users_v1";
const ORDERS_KEY="joservicing_orders_v1";
const SESSION_KEY="joservicing_session_v1";

function getUsers(){return JSON.parse(localStorage.getItem(USERS_KEY)||"[]")}
function saveUsers(x){localStorage.setItem(USERS_KEY,JSON.stringify(x))}
function getOrders(){return JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]")}
function saveOrders(x){localStorage.setItem(ORDERS_KEY,JSON.stringify(x))}
function currentUser(){const email=localStorage.getItem(SESSION_KEY);return getUsers().find(u=>u.email===email)}
function showRegister(){document.getElementById("loginForm").classList.add("hidden");document.getElementById("registerForm").classList.remove("hidden")}
function showLogin(){document.getElementById("registerForm").classList.add("hidden");document.getElementById("loginForm").classList.remove("hidden")}

function register(){
  const name=document.getElementById("registerName").value.trim();
  const email=document.getElementById("registerEmail").value.trim().toLowerCase();
  const password=document.getElementById("registerPassword").value;
  const msg=document.getElementById("registerMessage");
  if(!name||!email||!password){msg.textContent="Please fill in all fields.";return}
  if(password.length<6){msg.textContent="Password must be at least 6 characters.";return}
  const users=getUsers();
  if(users.some(u=>u.email===email)){msg.textContent="An account with that email already exists.";return}
  users.push({name,email,password});
  saveUsers(users);
  localStorage.setItem(SESSION_KEY,email);
  openDashboard();
}

function login(){
  const email=document.getElementById("loginEmail").value.trim().toLowerCase();
  const password=document.getElementById("loginPassword").value;
  const user=getUsers().find(u=>u.email===email&&u.password===password);
  const msg=document.getElementById("loginMessage");
  if(!user){msg.textContent="Email or password is incorrect.";return}
  localStorage.setItem(SESSION_KEY,email);
  openDashboard();
}

function logout(){localStorage.removeItem(SESSION_KEY);document.getElementById("site").classList.add("hidden");document.getElementById("loginScreen").classList.remove("hidden")}
function openDashboard(){
  const user=currentUser();
  if(!user)return;
  document.getElementById("customerName").textContent=user.name.split(" ")[0];
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("site").classList.remove("hidden");
  renderOrders();
}

function renderOrders(){
  const user=currentUser();
  if(!user)return;
  const mine=getOrders().filter(o=>o.email===user.email);
  const current=mine.filter(o=>o.status!=="Completed"&&o.status!=="Cancelled");
  const past=mine.filter(o=>o.status==="Completed"||o.status==="Cancelled");
  document.getElementById("currentOrders").innerHTML=current.length?current.map(orderHTML).join(""):'<div class="empty">No current orders.</div>';
  document.getElementById("pastOrders").innerHTML=past.length?past.map(orderHTML).join(""):'<div class="empty">No past orders yet.</div>';
}

function orderHTML(o){
  const cls=o.status==="In Process"?"process":o.status==="Cancelled"?"cancelled":"";
  return `<div class="order">
    <div class="order-top"><h3>${escapeHTML(o.service)}</h3><span class="price">£${o.price}</span></div>
    <span class="status ${cls}">${escapeHTML(o.status)}</span>
    <div class="order-meta"><b>Order:</b> ${escapeHTML(o.id)}<br><b>Bike:</b> ${escapeHTML(o.bike)}<br><b>Booked:</b> ${escapeHTML(o.date)}${o.notes?`<br><b>Notes:</b> ${escapeHTML(o.notes)}`:""}</div>
  </div>`;
}

function openBooking(){document.getElementById("bookingModal").classList.remove("hidden")}
function closeBooking(){document.getElementById("bookingModal").classList.add("hidden");document.getElementById("bookingMessage").textContent=""}
function placeOrder(){
  const user=currentUser();
  const service=document.getElementById("service").value;
  const bike=document.getElementById("bike").value.trim();
  const notes=document.getElementById("notes").value.trim();
  const msg=document.getElementById("bookingMessage");
  if(!bike){msg.textContent="Please enter your bike or model.";return}
  const price=service==="Basic Service"?30:50;
  const id="JO-"+Math.floor(100000+Math.random()*900000);
  const date=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  const orders=getOrders();
  orders.unshift({id,email:user.email,service,price,bike,notes,status:"In Process",date});
  saveOrders(orders);
  document.getElementById("bike").value="";
  document.getElementById("notes").value="";
  closeBooking();
  renderOrders();
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

if(localStorage.getItem(SESSION_KEY)&&currentUser())openDashboard();
