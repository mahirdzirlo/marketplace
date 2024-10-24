"use strict";
const pool = require("../config/database");

module.exports.createOrder = async function createOrder(req, res) {
  try {
    console.log("createOrder req body", req.body);
    const { buyer_id, seller_id, product_id } = req.body;
    const user = req.user;

    if (
      !buyer_id ||
      !seller_id ||
      !product_id ||
      !user ||
      user.role !== "buyer"
    ) {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query(
      "INSERT INTO orders (product_id, buyer_id, seller_id) VALUES ($1, $2, $3)",
      [product_id, buyer_id, seller_id]
    );
    res.status(200).send("ok");
  } catch (err) {
    console.log("createOrder error", err);
    res.status(500).send();
  }
};

module.exports.updateOrder = async function updateOrder(req, res) {
  try {
    console.log("updateOrder req body", req.body);
    const user = req.user;
    const { id } = req.body;

    if (!id || !user || user.role !== "seller") {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query("UPDATE orders SET status = $1 WHERE id = $2 ", [
      "approved",
      id,
    ]);

    res.status(200).send("ok");
  } catch (error) {
    console.log("updateOrder error", error);
    res.status(500).send();
  }
};

module.exports.getOrdersByUser = async function getOrdersByUser(req, res) {
  try {
    const user = req.user;
    if (!user || !user.role === "buyer") {
      res.status(401).send("unauthorized");
      return;
    }
    const data = await pool.query(
      "SELECT orders.status, products.name, products.description,products.price FROM orders JOIN public.products on orders.product_id=products.id WHERE buyer_id=$1",
      [user.id]
    );

    res.status(200).send(data.rows);
  } catch (err) {
    console.log("getProducts error", err);
    res.status(500).send();
  }
};

module.exports.getOrdersBySeller = async function getOrdersBySeller(req, res) {
  try {
    const user = req.user;
    if (!user || !user.role === "seller") {
      res.status(401).send("unauthorized");
      return;
    }
    const data = await pool.query(
      "SELECT orders.id, orders.status, products.name, products.description,products.price FROM orders JOIN public.products on orders.product_id=products.id WHERE orders.seller_id=$1",
      [user.id]
    );

    res.status(200).send(data.rows);
  } catch (err) {
    console.log("getProducts error", err);
    res.status(500).send();
  }
};
