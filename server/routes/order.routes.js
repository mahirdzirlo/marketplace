const controller = require("../controllers/order.controller");
const { authJWT } = require("../middleware/auth");

module.exports = function (app) {
  app.get("/api/order", authJWT, controller.getOrdersByUser);
  app.get("/api/order/seller", authJWT, controller.getOrdersBySeller);
  app.post("/api/order", authJWT, controller.createOrder);
  app.patch("/api/order/approve", authJWT, controller.updateOrder);
};
