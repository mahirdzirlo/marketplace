import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editError, setEditError] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const editformRef = useRef([]);
  const nav = useNavigate();
  const fetchProducts = async () => {
    const response = await api.get("/approvedproducts");
    setProducts(response.data);
  };
  const fetchOrders = async () => {
    const response = await api.get("/order");
    setOrders(response.data);
  };

  useEffect(() => {
    setUser(localStorage.getItem("userID"));
    fetchProducts();
    fetchOrders();
  }, []);

  const handleBuy = async (e, id) => {
    e.preventDefault();
    setEditError("");
    setMessage("");

    try {
      const product = products.filter((product) => product.id === id);

      const response = await api.post("/order", {
        buyer_id: user,
        product_id: id,
        seller_id: product[0].seller_id,
      });
      if (response.status === 200) {
        setMessage("Saved successfully");
        fetchOrders();
      } else {
        setEditError("Failed to save");
      }
    } catch (err) {
      setEditError(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <div className="w-full text-primaryBlack h-screen flex flex-col items-start gap-2 p-4">
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <h2 className="text-center text-lightBlue text-2xl mb-4">Your Orders</h2>
      {orders?.map((order) => (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 mb-3 flex flex-row gap-2  items-baseline justify-between h-fit"
          key={order.id}
        >
          <h3>{order.name}</h3>
          <p>{order.description}</p>
          <p>{order.price}</p>
          <p>{order.status}</p>
        </div>
      ))}
      <h2 className="text-center text-lightBlue text-2xl mb-4">All Products</h2>
      <div>
        <div className="text-red-500">{editError}</div>
        <div className="text-green-500">{message}</div>
      </div>
      {products.map((product) => (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 mb-3 flex flex-row gap-2  items-baseline justify-between h-fit"
          key={product.id}
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <form
            className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 gap-3 flex flex-col  items-start"
            ref={(el) => {
              editformRef.current[product.id] = el;
            }}
            onSubmit={(e) => handleBuy(e, product.id)}
          >
            <div className="flex flex-row gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Buy
              </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}

export default BuyerDashboard;
