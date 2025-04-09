// server/api/setoran/create.post.ts
import { connectToDB } from "~/server/utils/mongoose";
import Setoran from "~/server/models/Setoran";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const body = await readBody(event);

  const setoran = await Setoran.create(body);

  return {
    message: "Setoran berhasil dikirim",
    setoran,
  };
});
