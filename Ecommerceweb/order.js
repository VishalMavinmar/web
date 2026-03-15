const cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("orderItems");

let total = 0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

container.innerHTML += `

<div class="order-item">

<img src="${item.img}">

<div>

<h4>${item.name}</h4>

<p>$${item.price} × ${item.qty}</p>

</div>

</div>

`;

});

document.getElementById("totalPrice").innerText = total;

function confirmOrder(){

alert("Order Placed Successfully 🎉");

localStorage.removeItem("cart");

window.location.href="ordersuccess.html";

}