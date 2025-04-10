// server/api/admin/santri/[id].delete.ts
import { defineEventHandler } from "h3";
import { Santri } from "~/server/models/Santri";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const id = event.context.params?.id;

  try {
    await Santri.findByIdAndDelete(id);
    return { success: true, message: "Santri berhasil dihapus." };
  } catch (err) {
    return { success: false, message: "Gagal menghapus santri." };
  }
});
