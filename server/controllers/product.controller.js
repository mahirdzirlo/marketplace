"use strict";
const pool = require("../config/database");

module.exports.createProduct = async function createProduct(req, res) {
  try {
    console.log("createProduct req body", req.body);
    const user = req.user;

    const { name, description, price } = req.body;

    if (!user || !name || !description || !price || user.role !== "seller") {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query(
      "INSERT INTO products (name, description, price, seller_id) VALUES ($1, $2, $3, $4)",
      [name, description, price, user.id]
    );

    res.status(200).send("ok");
  } catch (err) {
    console.log("createProduct error", err);
    res.status(500).send();
  }
};
module.exports.getProducts = async function getProducts(req, res) {
  try {
    const user = req.user;
    if (!user || user.role !== "approver") {
      res.status(401).send("unauthorized");
      return;
    }
    const data = await pool.query("SELECT * FROM products");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log("getProduct error", err);
    res.status(500).send();
  }
};

module.exports.getApprovedProducts = async function getApprovedProducts(
  req,
  res
) {
  try {
    const user = req.user;
    if (!user || user.role !== "buyer") {
      res.status(401).send("unauthorized");
      return;
    }

    const data = await pool.query("SELECT * FROM products WHERE status = $1", [
      "approved",
    ]);

    res.status(200).send(data.rows);
  } catch (err) {
    console.log("getProduct error", err);
    res.status(500).send();
  }
};
module.exports.getProductsBySeller = async function getProductsBySeller(
  req,
  res
) {
  try {
    const user = req.user;
    if (!user || user.role !== "seller") {
      res.status(401).send("unauthorized");
      return;
    }
    const data = await pool.query(
      "SELECT * FROM products WHERE seller_id = $1",
      [user.id]
    );

    res.status(200).send(data.rows);
  } catch (err) {
    console.log("getProducts error", err);
    res.status(500).send();
  }
};

module.exports.updateProductByID = async function updateProductByID(req, res) {
  try {
    console.log("updateProduct req body", req.body);
    const user = req.user;
    if (!user || user.role !== "seller") {
      res.status(401).send("unauthorized");
      return;
    }
    const { id, name, description, price } = req.body;

    if (!id || !name || !description || !price) {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, price, id]
    );

    res.status(200).send("ok");
  } catch (err) {
    console.log("updateProduct error", err);
    res.status(500).send();
  }
};

module.exports.deleteProduct = async function deleteProduct(req, res) {
  try {
    console.log("deleteProduct req params", req.params);
    const user = req.user;

    const { id } = req.params;

    if (!id || !user || user.role !== "seller") {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).send("ok");
  } catch (err) {
    console.log("deleteProduct error", err);
    res.status(500).send();
  }
};

module.exports.approveProduct = async function approveProduct(req, res) {
  try {
    console.log("approveProduct req body", req.body);
    const { id, status } = req.body;
    const user = req.user;
    if (!user || user.role !== "approver") {
      res.status(401).send("unauthorized");
      return;
    }
    if (!id || !status) {
      console.log("missing params");
      res.status(400).send("bad input parameter");
      return;
    }

    await pool.query("UPDATE products SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.status(200).send("ok");
  } catch (error) {
    console.log("approveProduct error", error);
    res.status(500).send();
  }
};
