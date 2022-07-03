const jwt = require("jsonwebtoken");

// token is valid ? token is present ?
// utiliser token du headers pour verifier chemin CRUD
// userId == verify token

/* verifier si token existant et valide */
// const { cookies } = req;
// if (!cookies || !cookies.ACCESS_TOKEN_SECRET) {
//   return res.status(401).json({ error });
// }

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decodedToken Id", decodedToken.userId);

    const userId = decodedToken.userId;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
