
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { users } from "../schema/users.schema.js";
import { eq } from "drizzle-orm";

const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!foundUser || foundUser.length === 0) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

       req.user = foundUser[0];

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protectRoute;
