import { defineEventHandler, readBody } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    const updated = await Halaqoh.findByIdAndUpdate(id, body, { new: true });
    return { success: true, data: updated };
  } catch (err) {
    console.error("Gagal update halaqoh:", err);
    return { success: false, message: "Gagal update halaqoh." };
  }
});
