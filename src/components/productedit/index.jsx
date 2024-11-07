import { useState } from "react";
import axios from "axios";
import "./index.css";

const EditProduct = ({
  editingProduct,
  cancelEditProduct,
  isEditproductInDAtaBase,
}) => {
  const [product, setproduct] = useState(editingProduct);
  const getEditProduct = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.append("name", product.name);
    params.append("productId", product.product_id);
    params.append("category", product.category);
    params.append("price", product.price);
    params.append("imgUrl", product.img_url);
    params.append("description", product.description);
    const response = await axios.put(
      `http://localhost:3005/api/products?productId=${product.product_id}`,
      params.toString()
    );
    if (response.data.message === "Product Updated Successfully") {
      isEditproductInDAtaBase(product);
      document.getElementById("error-msg").textContent = "";
    } else {
      document.getElementById("error-msg").textContent = "Try Again";
    }
  };
  const handelName = (event) => {
    setproduct({ ...product, name: event.target.value });
  };
  const handeldescription = (event) => {
    setproduct({ ...product, description: event.target.value });
  };
  const handelimag = (event) => {
    setproduct({ ...product, img_url: event.target.value });
  };
  const handelCategory = (event) => {
    setproduct({ ...product, category: event.target.value });
  };
  const handelPrice = (event) => {
    setproduct({ ...product, price: parseInt(event.target.value) });
  };

  return (
    <div>
      <div className="product-edit-popup">
        <div className="product-edit-form">
          <h2 className="text-balck">Product Edit</h2>
          <form>
            <label>
              Product Name:
              <input
                id="name"
                type="text"
                placeholder="Enter Product Name"
                value={product.name || ""}
                onChange={handelName}
              />
            </label>
            <label>
              Description:
              <input
                id="description"
                type="text"
                placeholder="Enter Description"
                value={product.description || ""}
                onChange={handeldescription}
              />
            </label>
            <label>
              Category:
              <input
                id="categorys"
                type="text"
                placeholder="Enter Category Name"
                value={product.category || ""}
                onChange={handelCategory}
              />
            </label>
            <label>
              Image Url:
              <input
                id="image-url"
                type="text"
                placeholder="Enter Image Url"
                value={product.img_url || ""}
                onChange={handelimag}
              />
            </label>
            <label>
              Price:
              <input
                id="price"
                type="number"
                placeholder="Enter Price"
                value={product.price || ""}
                onChange={handelPrice}
              />
            </label>
            <center>
              <p id="error-msg"></p>
            </center>
            <div className="button-container">
              <button type="submit" onClick={getEditProduct}>
                Submit
              </button>
              <button type="button" onClick={cancelEditProduct}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
