import axios from "axios";
import "./index.css";

const AddProduct = ({ cancelAddProduct, addProduct, backToHomePage }) => {
  const getAddProduct = async (event) => {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let imageUrl = document.getElementById("image-url").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("categorys").value;
    let product = {
      name,
      description,
      imageUrl,
      price,
      category,
    };
    const params = new URLSearchParams();
    params.append("name", product.name);
    params.append("price", product.price);
    params.append("imageUrl", product.imageUrl);
    params.append("description", product.description);
    params.append("category", product.category);

    const response = await axios.post(
      "http://localhost:3005/api/products",
      params.toString()
    );
    //console.log(response)
    if (response.data.message === "Product Added Successfully") {
      document.getElementById("error-msg").textContent = "";
      addProduct();
      cancelAddProduct();
      backToHomePage();
    } else {
      document.getElementById("error-msg").textContent = "Error While Adding";
    }
  };

  return (
    <div>
      <div className="product-add-popup">
        <div className="product-add-form">
          <h2 className="text-balck">Add Product</h2>
          <form>
            <label>
              Product Name:
              <input
                id="name"
                type="text"
                placeholder="Enter Product Name"
                required
              />
            </label>
            <label>
              Description:
              <input
                id="description"
                type="text"
                placeholder="Enter Description"
                required
              />
            </label>
            <label>
              Image Url:
              <input
                id="image-url"
                type="text"
                placeholder="Enter Image Url"
                required
              />
            </label>
            <label>
              Category:
              <input
                id="categorys"
                type="text"
                placeholder="Enter Category Name"
                required
              />
            </label>
            <label>
              Price:
              <input
                id="price"
                type="number"
                placeholder="Enter Price"
                required
              />
            </label>
            <center>
              <p id="error-msg"></p>
            </center>
            <div className="button-container">
              <button type="submit" onClick={getAddProduct}>
                Submit
              </button>
              <button type="button" onClick={cancelAddProduct}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
