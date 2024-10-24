require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const port = process.env.PORT || 4000;
const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  console.log(`request body:${JSON.stringify(req.body)}`);
  next();
};

const app = express();

app.use(express.json());

app.use(logRequestStart);

app.use(cors());
app.use("/api/auth", authRoutes);
require("./routes/order.routes")(app);
require("./routes/product.routes")(app);

app.use(function (err, req, res, next) {
  console.log("app error", err);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = app;
