import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ApproverDashboard() {
  const [products, setProducts] = useState([]);
  const [editError, setEditError] = useState("");
  const [message, setMessage] = useState("");
  const editformRef = useRef([]);
  const nav = useNavigate();
  const fetchProducts = async () => {
    const response = await api.get("/product");
    setProducts(response.data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = async (e, id) => {
    e.preventDefault();
    setEditError("");
    setMessage("");

    try {
      const response = await api.patch("/productstatus", {
        id: id,
        status: editformRef.current[id]["status"].value,
      });
      if (response.status === 200) {
        setMessage("Saved successfully");
        fetchProducts();
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
            onSubmit={(e) => handleEdit(e, product.id)}
          >
            <select
              className="mb-3"
              defaultValue={product.status}
              name="status"
            >
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="pending">pending</option>
            </select>

            <div className="flex flex-row gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}

export default ApproverDashboard;
