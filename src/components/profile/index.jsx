import React, { useState } from "react";
import "./index.css";
import axios from "axios";

const ProfileCard = () => {
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const [isClickedEditProfile, setisClickedEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    id: user.id,
    name: user.name,
    mobileNumber: user.mobileNumber,
    adderss: user.address,
    email: user.email,
    cartItems: JSON.parse(localStorage.getItem("productsInCart"))
      ? JSON.parse(localStorage.getItem("productsInCart")).length
      : 0,
  });

  const handleEditProfile = () => {
    setisClickedEditProfile(true);
  };

  const handleNameChange = (event) => {
    setProfile({ ...profile, name: event.target.value });
  };
  const handleEmailChange = (event) => {
    setProfile({ ...profile, email: event.target.value });
  };
  const handleNumberChange = (event) => {
    setProfile({ ...profile, mobileNumber: event.target.value });
  };
  const handleAdderssChange = (event) => {
    setProfile({ ...profile, adderss: event.target.value });
  };

  const ChangeProfile = async (event) => {
    event.preventDefault();
    let params = new URLSearchParams();
    params.append("id", profile.id);
    params.append("name", profile.name);
    params.append("email", profile.email);
    params.append("mobileNumber", profile.mobileNumber);
    params.append("address", profile.address);
    let response = await axios.put(
      "http://localhost:3005/api/user",
      params.toString()
    );
    if (
      response.data.message ===
      "The length of the email should be above 5 characters"
    ) {
      document.getElementById("error-msg").textContent = "Invalid Email";
    } else if (response.data.message === "Error updating user details") {
      document.getElementById("error-msg").textContent =
        "Error updating Try Again";
      setTimeout(() => {
        setisClickedEditProfile(false);
      }, 1000);
    } else {
      document.getElementById("error-msg").textContent = "";
      localStorage.setItem("userDetails", JSON.stringify(profile));
      setisClickedEditProfile(false);
    }
  };

  const cancelEditProfile = () => {
    setisClickedEditProfile(false);
  };
  //console.log(isClickedEditProfile)
  return (
    <div className="profile-bg">
      {!isClickedEditProfile ? (
        <div className="profile-card">
          <h2>{profile.name}</h2>
          <p>
            <span className="pr-2">Email: </span> {profile.email}
          </p>
          <p>
            <span className="pr-2">Phone Number: </span> {profile.mobileNumber}
          </p>
          <p>
            <span className="pr-2">Address: </span> {profile.adderss}
          </p>
          <p>
            <span className="pr-2">Items in Cart: </span> {profile.cartItems}
          </p>
          <button
            className="btn btn-outline-warning mt-3 mb-3"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="profile-card">
          <form className="profile-form">
            <input
              id="name"
              type="text"
              placeholder="Enter Your Full Name"
              value={profile.name || ""}
              className="p-2"
              onChange={handleNameChange}
            />
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              className="p-2"
              value={profile.email || ""}
              onChange={handleEmailChange}
            />
            <input
              id="number"
              type="number"
              placeholder="Enter Your Number"
              className="p-2"
              value={profile.mobileNumber || ""}
              onChange={handleNumberChange}
            />
            <input
              id="adderss"
              type="text"
              placeholder="Add Your Address"
              className="p-2"
              value={profile.adderss || ""}
              onChange={handleAdderssChange}
            />
            <p id="error-msg"></p>
            <div className="button-container-profile">
              <button
                type="submit"
                className="btn btn-outline-info mt-3 mb-2"
                onClick={ChangeProfile}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger mt-3 mb-2 mr-2"
                onClick={cancelEditProfile}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
