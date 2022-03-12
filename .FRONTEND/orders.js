const orders_section=document.getElementById('orders_section');

console.log(orders_section);
axios.get("http://localhost:3000/getorders")
.then(response =>
    {
        
        for(var i=0;i<response.data.length;i++)
        {
            const order_det=document.createElement('div');
            order_det.classList.add("order_det");
            order_det.innerHTML=`<h4>${response.data[i].title}</h4><img src=${response.data[i].imageUrl}><h5>quantity:${response.data[i].cartItem.quantity}</h5>`;
            console.log(order_det);
            orders_section.appendChild(order_det);

        }
    
    })
    .catch(err => console.log(err));
