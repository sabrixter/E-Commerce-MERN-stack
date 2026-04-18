JWT_SECRET = "94e6c3eea3a0d557ab825dc31e72e93d6d7a5c7216f0a07d28f8c9c06b5bcc74";
const jwt = require("jsonwebtoken");


//general logged in or not check be it whatever of the 2 buyer or seller
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, usertype }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// checks if the user logged in is of the buyer usertype or not/ if not it returns error
const buyerOnly = (req, res, next) => {
  if (req.user.usertype !== "buyer") {
    return res.status(403).json({
      message: "Only buyers can access this resource",
    });
  }
  next();
};


//checks if the user logged in if of the seller usertype or not/ if not it returns error
const sellerOnly = (req, res, next) => {
  if (req.user.usertype !== "seller") {
    return res.status(403).json({
      message: "Only sellers are allowed",
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  buyerOnly,
  sellerOnly,
};
