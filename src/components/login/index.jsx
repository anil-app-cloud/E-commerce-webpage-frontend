import axios from "axios";
import "./index.css";
import { useState } from "react";

const Login = (props) => {
  const [isAdmin, setisAdmin] = useState(false);
  const { CancelLogin, loginSuccess } = props;
  const getLogin = async (event) => {  
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let AdminPassword = document.getElementById("password-admin")
      ? document.getElementById("password-admin").value
      : "null";
    let params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);
    params.append("AdminPassword", AdminPassword);

    const response = await axios.post(
      "http://localhost:3005/api/login",
      params.toString()
    );
    // console.log(response.data);
    if (response.data.message === "User Checking Success") {
      const userDetails = {
        id: response.data.user_id,
        name: response.data.user_name,
        email: response.data.email,
        address: response.data.address,
        mobileNumber: response.data.phoneNumber,
        isAdmin: false,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      document.getElementById("error-msg").textContent = "";
      await loginSuccess();
    } else if (response.data.message === "Admin User Checking Success") {
      const userDetails = {
        id: response.data.user_id,
        name: response.data.user_name,
        email: response.data.email,
        address: response.data.address,
        mobileNumber: response.data.phoneNumber,
        isAdmin: true,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      document.getElementById("error-msg").textContent = "";
      await loginSuccess();
    } else if (response.data.message === "Invalid Admin") {
      document.getElementById("error-msg").textContent = "Invalid Admin";
      document.getElementById("password-admin").value = "";
    } else if (response.data.message === "Invalid Password/email") {
      document.getElementById("error-msg").textContent =
        "Invalid Password/email";
    } else if (
      response.data.message === "Please enter required email and password"
    ) {
      document.getElementById("error-msg").textContent =
        "Please enter required email and password";
    } else {
      document.getElementById("error-msg").textContent = "Error while login";
    }

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  };

  return (
    <div>
      <div className="login-popup">
        <div className="login-form">
          <form>
            <h2 className="text-balck">Login</h2>
            <label>
              Email:
              <input id="email" type="text" placeholder="Enter Your Email" />
            </label>
            <label>
              Password:
              <input
                id="password"
                type="password"
                placeholder="Enter Your Password"
              />
            </label>
            {isAdmin && (
              <label>
                Admin Password:
                <input
                  id="password-admin"
                  type="password"
                  placeholder="Enter Your Admin Password"
                />
              </label>
            )}
            <center>
              <p id="error-msg"></p>
            </center>
            <div className="button-container">
              <div className="check-box-card">
                <label htmlFor="isAdmin" className="pt-2">
                  Admin:{" "}
                </label>
                <input
                  type="checkbox"
                  id="isAdmin"
                  onChange={() => {
                    setisAdmin((prevSate) => !prevSate);
                  }}
                />
              </div>
              <div className="buttons-card">
                <button type="submit" onClick={getLogin}>
                  Submit
                </button>
                <button type="button" onClick={CancelLogin}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
