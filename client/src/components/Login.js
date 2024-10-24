import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.user.id);

      switch (response.data.user.role) {
        case "approver":
          navigate("/approverdashboard");
          break;
        case "seller":
          navigate("/productdashboard");
          break;
        case "buyer":
          navigate("/buyerdashboard");
          break;
        default:
          break;
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="w-full  text-white h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl text-primaryBlack font-bold mb-4">
        Marketplace App
      </h2>
      <form
        className="bg-gray-100 p-4 rounded-lg shadow-md w-72 mx-auto flex flex-col"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full p-2 border border-gray-300 rounded-lg text-black mb-3"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded-lg text-black mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-primaryBlack">
        Login with username: seller and password: test
      </p>
      <p className="mt-4 text-primaryBlack">
        Or with username: buyer and password: test
      </p>
      <p className="mt-4 text-primaryBlack">
        Or with username: approver and password: test
      </p>
    </div>
  );
}

export default Login;
