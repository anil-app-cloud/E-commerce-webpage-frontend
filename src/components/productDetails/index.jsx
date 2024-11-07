import React, { useState } from "react";
import Order from "../order/index"
import "./index.css"; 

const ProductDetails = ({ product,editProductButtonClicked, deleteProduct, similarProducts, letGotoCart, letAddToCart, handleProductClick, backToHomePage, removeItemFromCart}) => {
  const [isClickBuyBtnInProductDetails, setisClickBuyBtnInProductDetails] = useState(false)
  const letAddToCarter = () => {
    letAddToCart(product)
  }
  const buyItemFromProduct = () => {
    let user = JSON.parse(localStorage.getItem("userDetails"))
    if (user !== null){
      setisClickBuyBtnInProductDetails(true)
    }else{
      alert("Please Login")
    }
  }
  //console.log(product['cartItem'])
  const removeItem = (productId) => {
    let oldProductsInCart = JSON.parse(localStorage.getItem("productsInCart"))
    let remaingProductsInCart = oldProductsInCart.filter(eachOne => eachOne.product_id !== productId)
    if (oldProductsInCart.length !== remaingProductsInCart){
      localStorage.setItem("productsInCart", JSON.stringify(remaingProductsInCart))
      removeItemFromCart(productId)
    }
    setisClickBuyBtnInProductDetails(false) 
    backToHomePage()  
  }

  const handleCancel = () => {
    setisClickBuyBtnInProductDetails(false)
  }

  return (
    <>
      <div className="product-details-container">
        <div className="product-details">
          <div className="product-image">
            <img src={product.img_url} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
            {!product['cartItem']?<button type="button" className="addingToCartBtn "id={`cartbtn${product.product_id}`} onClick={letAddToCarter}>Add to Cart</button>:
              <button id="go-cart" onClick={letGotoCart}>Go to Cart</button >}  
            <button id="buy-btn" className="mt-3" onClick={buyItemFromProduct}>Buy</button>
          </div>
        </div>
      </div>
    {isClickBuyBtnInProductDetails&&<Order 
      itemsForBuying={[product]}
      handleCancel={handleCancel}
      removeItem = {removeItem}
      />}
    </>
  );
};

export default ProductDetails;


