import { useState } from "react";
import axios from "axios";
import CartItem from "../cartItem/index";
import Order from "../order/index";
import "./index.css";

const Cart = (props) => {
  const { removeItemFromCart, productLis, updateItemsInCart } = props;
  const [cartItems, setcartItems] = useState(
    JSON.parse(localStorage.getItem("productsInCart"))
      ? JSON.parse(localStorage.getItem("productsInCart"))
      : []
  );
  const [isOredrClicked, setisOredrClicked] = useState(false);
  const [itemsForBuying, setitemsForBuying] = useState(
    JSON.parse(localStorage.getItem("productsInCart"))
      ? JSON.parse(localStorage.getItem("productsInCart"))
      : []
  );

  const removeItem = (productId) => {
    let oldProductsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    let remaingProductsInCart = oldProductsInCart.filter(
      (eachOne) => eachOne.product_id !== productId
    );
    localStorage.setItem(
      "productsInCart",
      JSON.stringify(remaingProductsInCart)
    );
    setcartItems(remaingProductsInCart);
    removeItemFromCart(productId);
  };

  const updateQuantity = async (productId, quantityValue) => {
    let productInCart = JSON.parse(localStorage.getItem("productsInCart"));
    let product = productInCart.filter((p) => p.product_id === productId)[0];
    let orginalPrice = productLis.filter((p) => p.product_id === productId)[0][
      "price"
    ];
    product["quantity"] = parseInt(quantityValue);
    product["price"] = orginalPrice * quantityValue;
    //console.log( productInCart)
    const user = JSON.parse(localStorage.getItem("userDetails"));
    const userId = user.id;
    let params = new URLSearchParams();
    params.append("productId", product.product_id);
    params.append("userId", userId);
    params.append("quantity", quantityValue);
    let response = await axios.put(
      "http://localhost:3005/api/Cart",
      params.toString()
    );
    //console.log(response.data)
    if (response.data.message === "Success") {
      localStorage.setItem("productsInCart", JSON.stringify(productInCart));
    }
    localStorage.setItem("productsInCart", JSON.stringify(productInCart));
    setcartItems(productInCart);
    setitemsForBuying(productInCart);
    updateItemsInCart();
  };

  const buyTotalItemsInCart = () => {
    setitemsForBuying(JSON.parse(localStorage.getItem("productsInCart")));
    setisOredrClicked(true);
  };
  const buyItemFromCArt = (product) => {
    setitemsForBuying([product]);
    setisOredrClicked(true);
  };
  const handleCancel = () => {
    setisOredrClicked(false);
  };

  const clearCart = () => {
    let productsIncart = JSON.parse(localStorage.getItem("productsInCart"));
    productsIncart.map((eachItem) => removeItem(eachItem.product_id));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price;
  }, 0);
  //console.log(totalPrice)
  return (
    <div className="cart-container ml-3">
      <div className="cart-header">
        <h2 className="cart-title">Cart</h2>
        {cartItems.length !== 0 && (
          <button
            className="btn btn-outline-danger ml-auto mr-5"
            onClick={clearCart}
          >
            <i className="fa-solid fa-trash-can-list"></i>clear
          </button>
        )}
      </div>
      {cartItems.length === 0 ? (
        <>
          <p className="empty-cart-message">Cart is empty</p>
          <div className="empty-card">
            <img
              src="https://www.nicepng.com/png/detail/231-2317775_no-products-in-cart-empty-shopping-cart-icon.png"
              className="Cart-empty-pic"
              alt="empty"
            />
          </div>
        </>
      ) : (
        <>
          {cartItems.map((product) => (
            <CartItem
              key={product.product_id}
              product={product}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              buyItemFromCArt={buyItemFromCArt}
            />
          ))}
          <div className="item-summery-card ">
            <p className="total-price">
              Total Price: &#x20B9;{totalPrice.toFixed(2)}
            </p>
            <hr />
            <button className="buy-button m-3" onClick={buyTotalItemsInCart}>
              Place Your Order
            </button>
          </div>
        </>
      )}
      {isOredrClicked && (
        <Order
          itemsForBuying={itemsForBuying}
          handleCancel={handleCancel}
          removeItem={removeItem}
        />
      )}
    </div>
  );
};

export default Cart;
