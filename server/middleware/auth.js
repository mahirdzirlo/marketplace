const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authJWT };
