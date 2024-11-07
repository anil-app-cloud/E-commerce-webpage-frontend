import "./index.css"; 

const CartItem = ({ product, removeItem,updateQuantity, buyItemFromCArt}) => {
  return (
    <div className="cart-item-container">
      <div className="item-image">
        <img src={product.img_url} alt={product.name} />
      </div>
      <div className="item-details">
        <h3 className="item-name">{product.name}</h3>
        <p className="item-description">{product.description}</p>
        <div className="item-controls">
          <span className="item-price">&#x20B9;{product.price.toFixed(2)}</span>
          <select
            className="quantity-select"
            value={product.quantity}
            onChange={(e) => updateQuantity(product.product_id, e.target.value)}
          >
            {Array.from({ length: 10 }, (_, index) => index + 1).map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
          <div className="btns">
          <button className="buy-button" onClick={() => {buyItemFromCArt(product)}}>Buy</button>
          <button className="remove-button" onClick={() => {removeItem(product.product_id)}}> <i className="fa-solid fa-trash"></i></button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CartItem;

