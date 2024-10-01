const { verifyToken } = require("../../helpers/token");

exports.tokenValidation = async (req, res, next) => {
  const bearerToken = req.headers["authorization"];

  if (!bearerToken) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const payload = verifyToken(token);

    if (!payload.id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    // const user = await findUserByEmail(payload.email);

    // if (!user) {
    //   return res.status(401).json({ message: "unauthorized" });
    // }

    // delete user.password;

    req.userId = payload.id;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid login", error });
  }
};
