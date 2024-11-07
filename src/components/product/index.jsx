import './index.css'
const Product = (props) => {
    const {product,editProductButtonClicked, isAdmin, letGotoCart, letAddToCart, handleProductClick, deleteProduct} = props   
    return(  
        <div className="product"  >
            {isAdmin && <div className='admin-btns'>
                <button className='product-edit-btn' onClick={() => {editProductButtonClicked(product)}}><i className="fa-solid fa-pen"></i></button>
                <button className='product-delete-btn' onClick={() => {deleteProduct(product.product_id, product)}}><i className="fa-sharp fa-solid fa-trash"></i></button>
            </div>}
            <button id={`cardbtn${product.product_id}`} className = "product-btn"onClick={() => {handleProductClick(product)}}>
                <img src={product.img_url} alt={product.name} className="product-img"/>
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>{product.description}</p>
                <p>&#x20B9;{product.price.toFixed(2)}</p>
            </button>
            {!product['cartItem']?<button type="button" className="addingToCartBtn"id={`cartbtn${product.product_id}`} onClick={() => {letAddToCart(product)}}>Add to Cart</button>:
            <button id="go-cart" onClick={letGotoCart}>Go to Cart</button >}  
        </div>     
        
    )
}

export default Product