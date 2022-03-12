
const cartPopUp=document.getElementById("cartItems");
const Close=document.getElementById("close");
const cart=document.getElementById("hCart");
const main=document.getElementById('main');
const cart_products=document.getElementById('cart_products');
const products=document.getElementById("products");
const purchase=document.getElementById('purchase');
var user_ID=[];




//get products---------------------------------------------------------


window.addEventListener('DOMContentLoaded', (event) => {
axios.get('http://localhost:3000/getproducts-count')
    .then(res =>{
    const totalProducts=res.data;
    var count=1;
    const totalPage=Math.ceil(totalProducts/2);
    const pageview=document.getElementById('pageview');
    while(count<=totalPage){
    const pagination=document.createElement('div');
    pagination.className="pagination";
    pagination.innerHTML=`<input type="hidden" value=${count}><h5 class="pageNum">${count}<h5>`;
    count++;
    pageview.appendChild(pagination);
    }


    pageview.addEventListener('click', (e)  =>
    {
        if(e.target.className==="pageNum") {
        const page = e.target.innerText;
        const value={
        page:page
        }
        console.log(value);
        axios.post("http://localhost:3000/getproducts", value)
        .then(res =>
        {
            if(res.status===200)
            {
                console.log("success");
            }
        })
        .catch(err => console.log(err));
        products.innerText="";
        }
        axios.get("http://localhost:3000/getproducts")
        .then((response) =>
        {
            for(var i=0;i<response.data.length;i++) {  
            product_Detail=document.createElement('div');
            product_Detail.id=`${response.data[i].id}`;
            product_Detail.classList.add('div3');
            product_Detail.innerHTML=`<h4>${response.data[i].title}</h4><img src="${response.data[i].imageUrl}" alt="">
            <h5>$${response.data[i].price}</h5><input type="hidden" value="${response.data[i].id}"><input type="hidden" value="${response.data[i].userId}">
            <button class="btn-cart">ADD TO CART</button>`;
            user_ID.push(response.data[0].userId)
            products.appendChild(product_Detail);
            }
        });
    });

})
    
    });




//cart------------------------------------------------------------

cart.addEventListener('click', () =>
{
    cartPopUp.style.display="block";
    axios.get("http://localhost:3000/getcart")
.then((response) =>{
    console.log(response.data);
    for(var i=0;i<response.data.length;i++) {
        const quantity=response.data[i].quantity;
        const cart_items=document.getElementById(response.data[i].productId);
        const name = cart_items.children[0].innerHTML;
        const image = cart_items.children[1].src;
        const price = cart_items.children[2].innerHTML;
        console.log(cart_items);
        purchaseItems=document.createElement('div');
        purchaseItems.classList.add('purchaseItems');
        purchaseItems.innerHTML=`<span class="nameS"><img src=${image} class="imageBox"><h4>${name}</h4></span><h5 class="priceS">${price}</h5><h5>${quantity}</h5><button id="remove">DELETE</button>`;
        cart_products.appendChild(purchaseItems);
    }
 products.style.display="none";

 purchase.addEventListener('click', () =>
{
    const order={
        cartId:response.data[0].cartId
    }
axios.post("http://localhost:3000/getorders", order)
.then((res) =>
{
    if(res.status===200)
    {
        console.log("post success");
    }
})
.catch(err => console.log(err));


axios.get("http://localhost:3000/getorders")
.then(response =>
    { var i=0;
console.log(user_ID[0]);
        while(user_ID[0]!==response.data[i].userId)
        {
            i++;
        }
        if(user_ID[0]===response.data[i].userId)
        {
            cart_products.innerText=`Order with orderId=${response.data[i].id} is successfull`;
            cart_products.innerHTML='';
        }

    })
    .catch(err => console.log(err));
});
})

.catch(err => console.log(err));

});


Close.addEventListener('click', () =>
{
    cartPopUp.style.display="none";
    products.style.display="flex";

});




//add to cart----------------------------------------------------------


products.addEventListener('click', (e) =>
{
     if(e.target.className==="btn-cart"){
        const name = e.target.parentNode.children[0].innerHTML;

        const productId=e.target.parentNode.children[3].value;
        const userId=e.target.parentNode.children[4].value;


        const obj={
            userId:userId,
            productId:productId
        }
        axios.post("http://localhost:3000/getcart", obj)
        .then((res) =>
        {
            if(res.status===200)
            {
                console.log("posting is successfull");
            }
        })
        .catch(err => console.log(err));


    const notif=document.createElement('div');
     notif.classList.add('toast');
     notif.innerHTML=`<h5>Your product: ${name} is successfully added to cart<h5>`;
     main.appendChild(notif);
     setTimeout(() =>
     {
         notif.remove()
     }, 3000);

    }
});

setTimeout(() => {
localStorage.setItem("user_ID",user_ID[0]);
},2000);


