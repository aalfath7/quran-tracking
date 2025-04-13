import jwt from "jsonwebtoken";
import { connectToDB } from "~/server/utils/mongoose";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error();

    return { user };
  } catch (err) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Token tidak valid" })
    );
  }
});
