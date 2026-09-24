import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({success: false, message: "Unauthorized"})
  }
};
