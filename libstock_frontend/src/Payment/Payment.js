import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const products = [
  { name: "Smartphone", price: 15000 },
  { name: "Headphones", price: 5000 },
  { name: "Laptop", price: 75000 },
];

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price / 100);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setPrice(((product.price * (quantity - 1)) / 100).toFixed(2));
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setPrice(((product.price * (quantity + 1)) / 100).toFixed(2));
  };

  const handleCheckout = async () => {
    try {
      const createPaymentRequest = {
        name: product.name,
        amount: product.price,
        quantity: quantity,
      };

      const response = await fetch(
        "http://localhost:8080/product/v1/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPaymentRequest),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stripeResponse = await response.json();
      const stripe = window.Stripe(
        "pk_test_51Qx1ss2eFvgnA4OILQbHkVQ4zM98oi6lvJoXZ1p3Cs5zqSGhjRPA6KOKUljpwaMCAjDoM5fZZtdFJG3oQklL9j6Y00DlqGvgJa"
      );
      const result = await stripe.redirectToCheckout({
        sessionId: stripeResponse.sessionId,
      });

      if (result.error) {
        console.error("Stripe Checkout Error:", result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card product-card text-center">
        <img
          src={product.image}
          className="card-img-top product-image"
          alt={product.name}
        />
        <div className="card-body">
          <h5 className="product-title">{product.name}</h5>
          <p className="product-price">Price: ${price}</p>
          <div className="quantity-controls my-3 d-flex justify-content-center align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              type="text"
              className="quantity-display form-control mx-2 text-center"
              value={quantity}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Explore Our Products</h1>
      <div className="row justify-content-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
