// server/api/setoran/list.get.ts
import { connectToDB } from "~/server/utils/mongoose";
import Setoran from "~/server/models/Setoran";

export default defineEventHandler(async () => {
  await connectToDB();

  const setorans = await Setoran.find().populate("santriId", "username");

  return {
    setorans,
  };
});
