import { useEffect, useState } from "react";
import axios from "axios";
import Login from "../login/index";
import Signup from "../signup/index";
import ProfileCard from "../profile/index";
import "./index.css";

const NavBAr = (props) => {
  const {
    productLis = [],
    filterCartProductsInHome = () => {},
    isAdmin,
    itemsCoubtInCart,
    letGotoCart,
    backToHomePage,
    productsData,
    showAddProductFrom,
  } = props;

  const [isLogin, setisLogin] = useState(!!localStorage.getItem("userDetails"));
  const [isClickedSignup, setisClickedSignup] = useState(false);
  const [isLoginClicked, setisLoginClicked] = useState(false);
  const [isClikedProfile, setisClickedProfile] = useState(false);

  const goToLogin = () => {
    setisLoginClicked(true);
    setisClickedSignup(false);
  };
  const searchClicked = (event) => {
    event.preventDefault();
    let userInput = document.getElementById("search-bar").value;
    //console.log(userInput)
    if (userInput) {
      productsData(userInput);
      backToHomePage();
      document.getElementById("search-bar").value = "";
      document.getElementById("category").value = "";
    }
  };
  const loginSuccess = async () => {
    
    let userId = JSON.parse(localStorage.getItem("userDetails")).id;
    let response = await axios.get(
      `http://localhost:3005/api/cart/cartItems?userId=${userId}`
    );
    let productsWithCartItems;
    // console.log("cartItems ",response.data)

    if (response.data.message === "Success") {
      let productsIds = response.data.products.map(
        (eachId) => eachId.product_id
      );
      // console.log(response.data.products)
      productsWithCartItems = productLis.map((eachProduct) => ({
        ...eachProduct,
        cartItem: productsIds.includes(eachProduct.product_id),
        quantity: productsIds.includes(eachProduct.product_id)
          ? response.data.products.filter(
              (eachOne) => eachProduct.product_id === eachOne.product_id
            )[0]["quantity"]
          : 0,
      }));

      let productsInUserCart = productsWithCartItems.filter((eachProduct) =>
        productsIds.includes(eachProduct.product_id)
      );

      localStorage.setItem(
        "productsInCart",
        JSON.stringify(productsInUserCart)
      );
      await filterCartProductsInHome(productsWithCartItems);
    }
    setisLogin(true);
  };

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userDetails"));
    const fun = async () => {
      if (user !== null) {
        await loginSuccess();
      }
    };

    fun();
  }, []);

  const CancelLogin = () => {
    setisLoginClicked(false);
  };

  const LogOutOff = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("productsInCart");
    backToHomePage();
    setisLogin(false);
    setisLoginClicked(false);
    setisClickedProfile(false);
  };

  const clickedSingup = () => {
    setisClickedSignup(true);
    setisLoginClicked(false);
  };

  const cancelSignUp = () => {
    setisClickedSignup(false);
  };

  const profileClicked = () => {
    setisClickedProfile((prevSatte) => !prevSatte);
  };
  //console.log(isClikedProfile)
  return (
    <div className="bg-conti">
      <div className="container-fulid">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg navbar-light bg-primary container-fulid text-white">
              <div className="navbar-brand">
                <div className="logo" onClick={backToHomePage}>
                  <img
                    src="https://logo.com/image-cdn/images/kts928pd/production/396f6f3c7f506eb9674c2a6e244249faeda83b00-424x419.png?w=1080&q=72"
                    id="imag"
                    alt="webpage"
                  />
                </div>
              </div>
              <form id="search-bar-card">
                <select
                  id="category"
                  onChange={(e) => {
                    document.getElementById("search-bar").value =
                      e.target.value;
                  }}
                >
                  <option value=""></option>
                  <option value="Clothing" className="p-3 m-5 mr-3 ml-3">
                    clothing
                  </option>
                  <option value="Grocery" className="p-3 m-5 mr-3 ml-3">
                    Grocery
                  </option>
                  <option value="Electronics" className="p-3 m-5 mr-3 ml-3">
                    Electronics
                  </option>
                </select>
                <input
                  type="text"
                  id="search-bar"
                  placeholder="Search for products"
                  className="pl-3"
                />
                <button id="search-btn" type="submit" onClick={searchClicked}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                    id="search-icon"
                  ></i>
                </button>
              </form>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse ml-auto" id="navbarNav">
                <ul className="navbar-nav ml-auto p-2">
                  {!isLogin && (
                    <li className="nav-item active bg-primary">
                      <button
                        className="nav-link option loged-btns p-2 m-2 text-white"
                        onClick={clickedSingup}
                      >
                        Signup
                      </button>
                      {isClickedSignup && (
                        <Signup cancelSignUp={cancelSignUp} />
                      )}
                    </li>
                  )}
                  {!isLogin && (
                    <li className="nav-item login-btn-li">
                      <button
                        className="nav-link option loged-btns p-2 m-2 text-white"
                        onClick={goToLogin}
                      >
                        Login
                      </button>
                      {isLoginClicked && (
                        <Login
                          CancelLogin={CancelLogin}
                          loginSuccess={loginSuccess}
                        />
                      )}
                    </li>
                  )}
                  {isLogin && isAdmin && (
                    <li className="nav-item">
                      <button
                        className="nav-link option loged-btns p-2 m-2 text-white"
                        onClick={showAddProductFrom}
                      >
                        Add Product
                      </button>
                    </li>
                  )}
                  {isLogin && (
                    <li className="nav-item  profile-card-for-cart ">
                      <p id="cart-items-count">{itemsCoubtInCart}</p>
                      <button
                        className="profile-btn mr-3 "
                        onClick={letGotoCart}
                      >
                        <img
                          src="https://www.freeiconspng.com/uploads/silver-shopping-cart-icon-14.png"
                          className="cart-png"
                          alt="cart"
                        />
                      </button>
                    </li>
                  )}
                  {isLogin && (
                    <li className="nav-item profile-card-for-cart mr-3">
                      <button className="profile-btn" onClick={profileClicked}>
                        <img
                          src="https://i.pinimg.com/1200x/26/61/9c/26619c16b5451afaa95956dff93ae3e5.jpg"
                          id="profile-png"
                          alt="profile"
                        />
                      </button>
                      {isClikedProfile && <ProfileCard />}
                    </li>
                  )}
                  {isLogin && (
                    <li className="nav-item">
                      <button
                        className="nav-link option loged-btns p-2 m-2 text-white"
                        onClick={LogOutOff}
                      >
                        Logout
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBAr;
