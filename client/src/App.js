import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ProductDashboard from "./components/ProductDasboard";
import ProtectedRoute from "./util/ProtectedRoute";
import ApproverDashboard from "./components/ApproverDashboard";
import BuyerDashboard from "./components/BuyerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/productdashboard"
          element={
            <ProtectedRoute>
              <ProductDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approverdashboard"
          element={
            <ProtectedRoute>
              <ApproverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyerdashboard"
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
