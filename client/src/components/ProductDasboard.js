import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [edit, setEdit] = useState(false);
  const formRef = useRef(null);
  const editformRef = useRef([]);
  const nav = useNavigate();

  const fetchOrders = async () => {
    const response = await api.get("/order/seller");
    setOrders(response.data);
  };
  const fetchProducts = async () => {
    const response = await api.post("/productseller");
    setProducts(response.data);
  };
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await api.post("/product", {
        name: formRef.current["name"].value,
        description: formRef.current["description"].value,
        price: formRef.current["price"].value,
      });
      if (response.status === 200) {
        setMessage("Saved successfully");
        fetchProducts();
      } else {
        setError("Failed to save");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleApprove = async (e, id) => {
    e.preventDefault();

    try {
      await api.patch("/order/approve", {
        id: id,
      });

      fetchOrders();
    } catch (err) {
      console.log("getProducts error", err);
    }
  };
  const handleEdit = async (e, id) => {
    e.preventDefault();
    setEditError("");

    try {
      const response = await api.patch("/product", {
        id: id,
        name: editformRef.current[id]["name"].value,
        description: editformRef.current[id]["description"].value,
        price: editformRef.current[id]["price"].value,
      });
      if (response.status === 200) {
        setEdit(false);
        fetchProducts();
      } else {
        setEditError("Failed to save");
      }
    } catch (err) {
      setEditError(err.response?.data?.message || err.message);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    formRef.current["name"].value = "";
    formRef.current["description"].value = "";
    formRef.current["price"].value = "";
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.status === 200) {
        fetchProducts();
      } else {
        setError("Failed to delete");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="w-full text-primaryBlack h-screen flex flex-col items-start gap-2 p-4">
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => setToggle(!toggle)}
        >
          Add Product
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      {toggle && (
        <>
          <form
            className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 gap-3 flex flex-col  items-start"
            ref={formRef}
            onSubmit={(e) => handleAddProduct(e)}
          >
            <input
              className="mb-3"
              type="text"
              name="name"
              placeholder="Product Name"
            />
            <input
              className="mb-3"
              type="text"
              name="description"
              placeholder="Description"
            />
            <input
              className="mb-3"
              type="number"
              name="price"
              placeholder="Price"
            />
            <div className="flex flex-row gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="reset"
                onClick={(e) => handleClear(e)}
              >
                Clear
              </button>
            </div>
          </form>
          <div className="text-red-500">{error}</div>
          <div className="text-green-500">{message}</div>
        </>
      )}
      <h2 className="text-center text-lightBlue text-2xl mb-4">Orders</h2>
      {orders?.map((order) => (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 mb-3 flex flex-row gap-2  items-baseline justify-between h-fit"
          key={order.id}
        >
          <h3>{order.name}</h3>
          <p>{order.description}</p>
          <p>{order.price}</p>
          <p>{order.status}</p>

          {order.status === "pending" && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(e) => handleApprove(e, order.id)}
            >
              Approve
            </button>
          )}
        </div>
      ))}

      <h2 className="text-center text-lightBlue text-2xl mb-4">
        Your Listings
      </h2>
      {products.map((product) => (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md w-full mb-3 flex flex-row gap-2  items-baseline justify-between h-fit"
          key={product.id}
        >
          <div className="flex flex-row gap-2">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
          {edit && (
            <>
              <form
                className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 gap-3 flex flex-col  items-start"
                ref={(el) => {
                  editformRef.current[product.id] = el;
                }}
                onSubmit={(e) => handleEdit(e, product.id)}
              >
                <input
                  className="mb-3"
                  type="text"
                  defaultValue={product.name}
                  name="name"
                  placeholder="Product Name"
                />
                <input
                  className="mb-3"
                  defaultValue={product.description}
                  type="text"
                  name="description"
                  placeholder="Description"
                />
                <input
                  className="mb-3"
                  defaultValue={product.price}
                  type="number"
                  name="price"
                  placeholder="Price"
                />
                <div className="flex flex-row gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
              <div className="text-red-500">{editError}</div>
            </>
          )}
          <div className="flex flex-row gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEdit(!edit)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductDashboard;
