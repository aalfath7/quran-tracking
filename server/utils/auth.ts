import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman";

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
