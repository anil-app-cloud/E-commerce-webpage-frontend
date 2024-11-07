import * as React from "react";
import NavBAr from "./components/navBar/index";
import Product from "./components/product/index";
import Cart from "./components/cart/index";
import ProductDetails from "./components/productDetails/index";
import AddProduct from "./components/productAdd/index";
import EditProduct from "./components/productedit/index";
import "./App.css";
import axios from "axios";
//ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
class App extends React.Component {
  state = {
    productLis: [],
    isGetProducts: false,
    isClickOnGotocartOrProductDetails: false,
    itemsCoubtInCart: localStorage.getItem("productsInCart")
      ? JSON.parse(localStorage.getItem("productsInCart")).length > 0
        ? JSON.parse(localStorage.getItem("productsInCart"))
            .map((quan) => parseInt(quan.quantity))
            .reduce((total, num) => total + num)
        : 0
      : 0,
    selectedProduct: false,
    similarProducts: [],
    searchProducts: [],
    isClickSearchBtn: false,
    addProductForm: false,
    iseditProductButtonClicked: false,
    editingProduct: null,
    isAdmin: false,
  };

  filterCartProductsInHome = (productsWithCartItems) => {
    //console.log(productsWithCartItems)
    let Admin = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails")).isAdmin
      : false;
    const { similarProducts, selectedProduct } = this.state;
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    let productIds = productsInCart.map((eachOne) => eachOne.product_id);
    if (similarProducts !== []) {
      let updatedSimlarProducts = similarProducts.map((eachItem) => {
        if (productIds.includes(eachItem.product_id)) {
          let itemInCart = productsInCart.filter(
            (eachProduct) => eachProduct.product_id === eachItem.product_id
          )[0];
          return itemInCart;
        } else {
          return eachItem;
        }
      });
      this.setState({
        isAdmin: Admin,
        productLis: productsWithCartItems,
        itemsCoubtInCart: localStorage.getItem("productsInCart")
          ? JSON.parse(localStorage.getItem("productsInCart")).length > 0
            ? JSON.parse(localStorage.getItem("productsInCart"))
                .map((quan) => parseInt(quan.quantity))
                .reduce((total, num) => total + num)
            : 0
          : 0,
        similarProducts: updatedSimlarProducts,
      });
    } else {
      this.setState({
        isAdmin: Admin,
        productLis: productsWithCartItems,
        itemsCoubtInCart: localStorage.getItem("productsInCart")
          ? JSON.parse(localStorage.getItem("productsInCart")).length > 0
            ? JSON.parse(localStorage.getItem("productsInCart"))
                .map((quan) => parseInt(quan.quantity))
                .reduce((total, num) => total + num)
            : 0
          : 0,
      });
    }

    if (selectedProduct !== false) {
      if (productIds.includes(selectedProduct.product_id)) {
        let selectedProductInCart = productsInCart.filter(
          (eachProduct) => eachProduct.product_id === selectedProduct.product_id
        )[0];
        this.setState({
          selectedProduct: selectedProductInCart,
          isAdmin: Admin,
        });
      }
    }
  };

  addCartItemsFromLocalStore = async (products) => {
    //console.log(products)
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
    let productsIds = productsInCart.map((p) => p.product_id);
    let productsWithCartItems = products.map((eachProduct) => ({
      ...eachProduct,
      cartItem: productsIds.includes(eachProduct.product_id),
      quantity: productsIds.includes(eachProduct.product_id)
        ? productsInCart.filter(
            (eachOne) => eachProduct.product_id === eachOne.product_id
          )[0]["quantity"]
        : 0,
    }));
    // console.log(productsWithCartItems)
    this.filterCartProductsInHome(productsWithCartItems);
  };
  backToHomePage = () => {
    const { productLis } = this.state;
    const user = JSON.parse(localStorage.getItem("userDetails"));
    let Admin = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails")).isAdmin
      : false;
    if (user === null) {
      //console.log("working user null function")
      let planeProducts = productLis.map((eachOne) => ({
        ...eachOne,
        cartItem: false,
      }));
      this.setState({
        isAdmin: Admin,
        isClickOnGotocartOrProductDetails: false,
        productLis: planeProducts,
        isClickSearchBtn: false,
      });
    } else {
      let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));
      let productsIdsInCart = productsInCart.map((p) => p.product_id);
      let updateProducts = productLis.map((p) => {
        if (productsIdsInCart.includes(p.product_id)) {
          return productsInCart.filter((e) => e.product_id === p.product_id)[0];
        } else {
          return p;
        }
      });
      //console.log(updateProducts)
      this.setState({
        productLis: updateProducts,
        isAdmin: Admin,
        isClickOnGotocartOrProductDetails: false,
        isClickSearchBtn: false,
      });
    }
  };

  productsData = async (userInput = "") => {
    const response = await axios.get(
      `http://localhost:3005/api/products?userInput=${userInput}`
    );
    // console.log("products",response.data)
    //console.log(userInput);
    try {
      let products = response.data.map((eachOne) => {
        eachOne["cartItem"] = false;
        return eachOne;
      });
      // console.log("userInput",userInput)
      if (userInput !== "") {
        
        let productsIdsInCart = localStorage.getItem("productsInCart")
          ? JSON.parse(localStorage.getItem("productsInCart")).map(
              (eachOne) => eachOne.product_id
            )
          : null;
        if (productsIdsInCart !== null) {
          // console.log("products in cart:", productsIdsInCart)
          let productsInCart = products.map((eachOne) => {
            eachOne["cartItem"] = productsIdsInCart.includes(
              eachOne.product_id
            );
            return eachOne;
          });
          this.setState({
            searchProducts: productsInCart,
            isGetProducts: true,
            isClickSearchBtn: true,
          });
        }
        this.setState({
          searchProducts: products,
          isGetProducts: true,
          isClickSearchBtn: true,
        });
      } else {
        
        this.setState({
          productLis: products,
          isGetProducts: true,
          isClickSearchBtn: false,
          searchProducts: [],
        });
      }
    } catch (err) {
      // console.log(err);
      this.setState({ isGetProducts: true, isClickSearchBtn: false });
    }
  };

  handleProductClick = (product) => {
    const { productLis } = this.state;
    const similarProducts = productLis.filter(
      (p) =>
        p.category === product["category"] &&
        p.product_id !== product["product_id"]
    );
    this.setState({
      selectedProduct: product,
      similarProducts: similarProducts.slice(0, 6),
      isClickOnGotocartOrProductDetails: true,
    });
  };

  updateItemsInCart = () => {
    //console.log("called updated")
    let countOfCart = localStorage.getItem("productsInCart")
      ? JSON.parse(localStorage.getItem("productsInCart")).length > 0
        ? JSON.parse(localStorage.getItem("productsInCart"))
            .map((quan) => parseInt(quan.quantity))
            .reduce((total, num) => total + num)
        : 0
      : 0;
    //console.log(countOfCart)
    this.setState({ itemsCoubtInCart: countOfCart });
  };

  letAddToCart = async (product) => {
    //console.log(product['cartItem'])
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user !== null) {
      const { productLis } = this.state;
      product["cartItem"] = true;
      product["quantity"] = 1;
      //console.log(productLis)
      const userId = user.id;
      let params = new URLSearchParams();
      params.append("productId", product.product_id);
      params.append("userId", userId);
      let response = await axios.post(
        "http://localhost:3005/api/Cart",
        params.toString()
      );
      if (response.data.message === "Success") {
        let productsInCart =
          JSON.parse(localStorage.getItem("productsInCart")) || [];
        if (productsInCart !== null) {
          let newproductsInCart = [...productsInCart, product];
          localStorage.setItem(
            "productsInCart",
            JSON.stringify(newproductsInCart)
          );
        }
        this.updateItemsInCart(productLis);
      }
    } else {
      alert("Please Login");
    }
  };
  letGotoCart = () => {
    this.setState({
      isClickOnGotocartOrProductDetails: true,
      selectedProduct: false,
    });
  };

  updateQuantity = (productId, quantityValue) => {
    const { productLis } = this.state;
    let product = productLis.filter((p) => p.product_id === productId)[0];
    product["quantity"] = parseInt(quantityValue);
    product["price"] = product["price"] * quantityValue;
    // console.log(product);
    this.setState({ productLis: productLis });
  };

  removeItemFromCart = async (productId) => {
    const { productLis } = this.state;
    let product = productLis.filter((p) => p.product_id === productId)[0];
    product["cartItem"] = false;
    const user = JSON.parse(localStorage.getItem("userDetails"));
    const userId = user.id;
    // console.log(productId)
    // console.log(userId)
    let response = await axios.delete(
      `http://localhost:3005/api/Cart?userId=${userId}&productId=${productId}`
    );
    //console.log(response)
    if (response.data.message === "Success") {
      this.updateItemsInCart();
    }
  };

  showAddProductFrom = () => {
    this.setState({ addProductForm: true });
  };
  addProduct = async (userInput = "") => {
    const response = await axios.get(
      `http://localhost:3005/api/products?userInput=${userInput}`
    );
    let products = response.data.map((eachOne) => {
      eachOne["cartItem"] = false;
      return eachOne;
    });
    await this.addCartItemsFromLocalStore(products);
  };
  cancelAddProduct = () => {
    this.setState({ addProductForm: false });
  };
  deleteProduct = async (productId) => {
    let { searchProducts, similarProducts, productLis } = this.state;
    const response = await axios.delete(
      `http://localhost:3005/api/products?productId=${productId}`
    );
    if (response.data.message === "Product Deleted Successfully") {
      const updatedSearchProducts = searchProducts.filter(
        (p) => p.product_id !== productId
      );
      const updatedSimilarProducts = similarProducts.filter(
        (p) => p.product_id !== productId
      );
      const updatedProductLis = productLis.filter(
        (p) => p.product_id !== productId
      );
      this.setState({
        searchProducts: updatedSearchProducts,
        similarProducts: updatedSimilarProducts,
        productLis: updatedProductLis,
      });
    }
  };
  editProductButtonClicked = async (product) => {
    //console.log(product)
    this.setState({
      iseditProductButtonClicked: true,
      editingProduct: product,
    });
  };
  cancelEditProduct = () => {
    this.setState({ iseditProductButtonClicked: false, editingProduct: null });
  };

  isEditproductInDAtaBase = async (updatedProduct) => {
    const productId = updatedProduct.product_id;

    const updatedSearchProducts = this.state.searchProducts.map((p) =>
      p.product_id === productId ? updatedProduct : p
    );
    const updatedSimilarProducts = this.state.similarProducts.map((p) =>
      p.product_id === productId ? updatedProduct : p
    );
    const updatedProductLis = this.state.productLis.map((p) =>
      p.product_id === productId ? updatedProduct : p
    );
    this.setState({
      searchProducts: updatedSearchProducts,
      similarProducts: updatedSimilarProducts,
      productLis: updatedProductLis,
      iseditProductButtonClicked: false,
      editingProduct: null,
    });
  };

  componentDidMount() {
    this.productsData();
  }

  render() {
    const {
      productLis,
      isAdmin,
      editingProduct,
      iseditProductButtonClicked,
      isClickSearchBtn,
      addProductForm,
      isGetProducts,
      isClickOnGotocartOrProductDetails,
      itemsCoubtInCart,
      selectedProduct,
      similarProducts,
      searchProducts,
    } = this.state;
    let renderProducts;
    if (isClickSearchBtn === false) {
      renderProducts = productLis;
    } else {
      renderProducts = searchProducts;
    }
    return (
      <div className="mb-3" id="main-card">
        {isGetProducts && (
          <NavBAr
            productLis={productLis}
            filterCartProductsInHome={this.filterCartProductsInHome}
            itemsCoubtInCart={itemsCoubtInCart}
            letGotoCart={this.letGotoCart}
            backToHomePage={this.backToHomePage}
            productsData={this.productsData}
            showAddProductFrom={this.showAddProductFrom}
            isAdmin={isAdmin}
          />
        )}
        {!isGetProducts && <NavBAr />}
        <>
          {!isClickOnGotocartOrProductDetails ? (
            <div className="products-card">
              <h2>Featured Products</h2>
              {isGetProducts?(
              <div className="products">
                {renderProducts.map((product) => (
                  <Product
                    key={product.product_id}
                    product={product}
                    letGotoCart={this.letGotoCart}
                    letAddToCart={this.letAddToCart}
                    handleProductClick={this.handleProductClick}
                    deleteProduct={this.deleteProduct}
                    editProductButtonClicked={this.editProductButtonClicked}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
              ):(<div className="loading-spinner">
                <div className="spinner"></div>
              </div>)}
            </div>
          ) : !selectedProduct ? (
            <Cart
              productLis={productLis}
              backToHomePage={this.backToHomePage}
              removeItemFromCart={this.removeItemFromCart}
              updateQuantity={this.updateQuantity}
              updateItemsInCart={this.updateItemsInCart}
            />
          ) : (
            <div id="product-listing">
              <ProductDetails
                product={selectedProduct}
                similarProducts={similarProducts}
                letGotoCart={this.letGotoCart}
                letAddToCart={this.letAddToCart}
                handleProductClick={this.handleProductClick}
                backToHomePage={this.backToHomePage}
                removeItemFromCart={this.removeItemFromCart}
                deleteProduct={this.deleteProduct}
                editProductButtonClicked={this.editProductButtonClicked}
              />
              <div className="similar-products mr-3 mb-1">
                <h3>Similar Products</h3>
                <div className="products mr-3">
                  {similarProducts.map((product) => (
                    <Product
                      key={product.product_id}
                      product={product}
                      letGotoCart={this.letGotoCart}
                      letAddToCart={this.letAddToCart}
                      handleProductClick={this.handleProductClick}
                      deleteProduct={this.deleteProduct}
                      editProductButtonClicked={this.editProductButtonClicked}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
        {addProductForm && (
          <AddProduct
            cancelAddProduct={this.cancelAddProduct}
            addProduct={this.addProduct}
            backToHomePage={this.backToHomePage}
          />
        )}
        {iseditProductButtonClicked && (
          <EditProduct
            editingProduct={editingProduct}
            cancelEditProduct={this.cancelEditProduct}
            isEditproductInDAtaBase={this.isEditproductInDAtaBase}
          />
        )}
      </div>
    );
  }
}

export default App;
