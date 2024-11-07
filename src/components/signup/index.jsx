import axios from "axios";
import "./index.css";

const Signup = (props) => {
  const { cancelSignUp } = props;

  const getSignUp = async (event) => {
    event.preventDefault();
    let userName = document.getElementById("name").value;
    let phoneNumber = document.getElementById("number").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let conformPassword = document.getElementById("conform-password").value;
    let adderss = document.getElementById("adderss").value;
    if (password === conformPassword) {
      const params = new URLSearchParams();
      params.append("userName", userName);
      params.append("phoneNumber", phoneNumber);
      params.append("email", email);
      params.append("password", password);
      params.append("adderss", adderss);
      const response = await axios.post(
        "http://localhost:3005/api/signup",
        params.toString()
      );
      console.log(response.data);
      if (response.data.message === "The length of name should be above 2") {
        document.getElementById("error-msg").style.color = "red";
        document.getElementById("error-msg").textContent =
          "The length of name should be above 2";
      } else if (
        response.data.message ===
        "The length of the email should be above 5 characters"
      ) {
        document.getElementById("error-msg").style.color = "red";
        document.getElementById("error-msg").textContent = "Email Error";
      } else if (
        response.data.message ===
        "The length of the Password should be above 3 characters"
      ) {
        document.getElementById("error-msg").style.color = "red";
        document.getElementById("error-msg").textContent =
          "The length of the Password should be above 3 characters";
      } else if (response.data.message === "Email already exists") {
        document.getElementById("error-msg").style.color = "red";
        document.getElementById("error-msg").textContent = "Email already exit";
      } else if (response.data.message === "Error While create user") {
        document.getElementById("error-msg").style.color = "red";
        document.getElementById("error-msg").textContent =
          "Error While create user";
      } else {
        document.getElementById("error-msg").style.color = "green";
        document.getElementById("error-msg").textContent =
          "Registation Success";

        setTimeout(() => {
          cancelSignUp();
        }, 1000);
      }
    } else {
      document.getElementById("error-msg").style.color = "red";
      document.getElementById("error-msg").textContent =
        "PAssword did not match";
    }

    document.getElementById("name").value = "";
    document.getElementById("number").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("conform-password").value = "";
    document.getElementById("adderss").value = "";
  };

  return (
    <div>
      <div className="signup-popup">
        <div className="signup-form">
          <h2 className="text-balck">signup</h2>
          <form>
            <label>
              Username:
              <input
                id="name"
                type="text"
                placeholder="Enter Your Full Name"
                required
              />
            </label>
            <label>
              Mobile Number:
              <input
                id="number"
                type="number"
                placeholder="Enter Your Number"
                required
              />
            </label>
            <label>
              Email:
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                required
              />
            </label>
            <label>
              Password:
              <input
                id="password"
                type="password"
                placeholder="Set Your Password"
                required
              />
            </label>
            <label>
              Retype Password:
              <input
                id="conform-password"
                type="password"
                placeholder="Retype Your Password"
                required
              />
            </label>
            <label>
              Adderss:
              <input
                id="adderss"
                type="text"
                placeholder="Add Your Adderss"
                required
              />
            </label>
            <center>
              <p id="error-msg"></p>
            </center>
            <div className="button-container">
              <button type="submit" onClick={getSignUp}>
                Submit
              </button>
              <button type="button" onClick={cancelSignUp}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
