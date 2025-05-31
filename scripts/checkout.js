import {cart, removeFromCart, updateDeliveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurreny } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from  '../data/deliveryOptions.js';


let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

const deliveryOptionId = cartItem.deliveryOptionId;

let deliveryOption;

deliveryOptions.forEach((option) => {
  if (option.id === deliveryOptionId) {
    deliveryOption = option;
  }

});

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const DateString = deliveryDate.format('dddd, MMMM D');




cartSummaryHTML +=
  `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${DateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurreny(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${renderDeliveryOptions(matchingProduct,cartItem)}
                
              </div>
            </div>
          </div>
  `

});
;

function renderDeliveryOptions(matchingProduct,cartItem){
  let html = '';

  deliveryOptions.forEach((options) => {
    const today = dayjs();
    const deliveryDate = today.add(options.deliveryDays, 'days');
    const DateString = deliveryDate.format('dddd, MMMM D');
    const priceCents = options.priceCents === 0
    ? 'FREE Shipping'
    : `$${formatCurreny(options.priceCents)}`;

    const isChecked = options.id === cartItem.deliveryOptionId;
    html +=
    `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${options.id}">
                  <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${DateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceCents} - Shipping
                    </div>
                  </div>
                </div>
    `
  });

  return html;
}





document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);


    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
  });
}
);

document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const {productId, deliveryOptionId} = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
  });
});