const controller = require("../controllers/product.controller");
const { authJWT } = require("../middleware/auth");

module.exports = function (app) {
  app.get("/api/product", authJWT, controller.getProducts);
  app.get("/api/approvedproducts", authJWT, controller.getApprovedProducts);
  app.post("/api/product", authJWT, controller.createProduct);
  app.delete("/api/product/:id", authJWT, controller.deleteProduct);
  app.patch("/api/product", authJWT, controller.updateProductByID);
  app.patch("/api/productstatus", authJWT, controller.approveProduct);
  app.post("/api/productseller", authJWT, controller.getProductsBySeller);
};
