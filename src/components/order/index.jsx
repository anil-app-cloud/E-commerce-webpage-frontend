import React, { useRef } from "react";
import "./index.css";
import axios from "axios";

const Order = ({ itemsForBuying, handleCancel, removeItem }) => {
  itemsForBuying = itemsForBuying.map((eachItem) => {
    if (eachItem["quantity"] > 0) {
      return eachItem;
    } else {
      eachItem["quantity"] = 1;
      return eachItem;
    }
  });
  const totalItems = itemsForBuying.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = itemsForBuying.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 5;
  const savedAmount = (totalPrice * (discount / 100)).toFixed(2);
  const payableAmount = (totalPrice - savedAmount).toFixed(2);

  const cashOnDeliveryRef = useRef(null);
  const upiRef = useRef(null);
  const netPaymentRef = useRef(null);

  const handleProceed = async () => {
    try{

      if (
        cashOnDeliveryRef.current.checked ||
        upiRef.current.checked ||
        netPaymentRef.current.checked
      ) {
        let user = JSON.parse(localStorage.getItem("userDetails"));
        let params = new URLSearchParams();
        params.append("userId", user.id);
        params.append("buyingItems", JSON.stringify(itemsForBuying));
        params.append("totalPrice", payableAmount)
        let response = await axios.post(
          "http://localhost:3005/api/Order",
          params.toString()
        );
        // console.log(response.data)
        document.getElementById("order-msg").textContent = "Success, Thank You";
        document.getElementById("order-msg").style.color = "#33cc33";
        itemsForBuying.map((eachItem) => removeItem(eachItem.product_id));
        setTimeout(() => {
          handleCancel();
        }, 2000);
      } else {
        document.getElementById("order-msg").textContent =
          "Please select Payment Method";
        document.getElementById("order-msg").style.color = "red";
      }
    }catch{
      handleCancel();
    }
  };

  return (
    <div className="order-bg">
      <div className="order-card">
        <div className="order-header">Order Summary</div>
        <div className="order-items">
          <div>Total Items:</div>
          <div>{totalItems}</div>
        </div>
        <div className="order-subtotal">
          <div>Total:</div>
          <div>&#x20B9;{totalPrice.toFixed(2)}</div>
        </div>
        <div className="order-discount">
          <div>Discount:</div>
          <div>5%</div>
        </div>
        <div className="order-discount">
          <div>SavedAmount:</div>
          <div>&#x20B9;{savedAmount}</div>
        </div>
        <div className="order-total">
          <div>Fixed:</div>
          <div>&#x20B9;{payableAmount}</div>
        </div>
        <div className="order-payment">
          <div>
            <input type="radio" name="payment" ref={cashOnDeliveryRef} /> Cash
            on Delivery
          </div>
          <div>
            <input type="radio" name="payment" ref={upiRef} /> UPI
          </div>
          <div>
            <input type="radio" name="payment" ref={netPaymentRef} />
            Net Payment
          </div>
        </div>
        <p id="order-msg"></p>
        <div className="order-actions">
          <button className="proceed-button" onClick={handleProceed}>
            Proceed
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
