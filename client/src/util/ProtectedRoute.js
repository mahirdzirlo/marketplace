import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const authed = token ? true : false;
  return authed ? children : <Navigate to="/" />;
};

export default PrivateRoute;
