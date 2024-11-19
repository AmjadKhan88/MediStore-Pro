import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "amjadullah";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token,JWT_SECRET);
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Token verification failed" });
  }
};

export default authMiddleware;
