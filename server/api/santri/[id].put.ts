// server/api/admin/santri/[id].put.ts
import { defineEventHandler, readBody } from "h3";
import { Santri } from "~/server/models/Santri";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    const updated = await Santri.findByIdAndUpdate(id, body, { new: true });
    return { success: true, data: updated };
  } catch (err) {
    return { success: false, message: "Gagal update santri." };
  }
});
