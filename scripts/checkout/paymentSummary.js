import { cart }  from "../../data/cart.js";


export function renderPaymentSummary(){
  cart.forEach((cartItem) => {
      let matchingProduct;
      let productPriceCents = 0;
    
      products.forEach((product) => {
        if (product.id === cartItem.productId) {
          matchingProduct = product;
        }

      productPriceCents += product.priceCents * cartItem.quantity;
      });

      console.log(productPriceCents);
  });
}


renderPaymentSummary();