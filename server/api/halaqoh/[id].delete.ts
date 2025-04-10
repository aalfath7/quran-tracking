import { defineEventHandler } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();
  const id = event.context.params?.id;

  try {
    await Halaqoh.findByIdAndDelete(id);
    return { success: true, message: "Halaqoh berhasil dihapus." };
  } catch (err) {
    console.error("Gagal hapus halaqoh:", err);
    return { success: false, message: "Gagal menghapus halaqoh." };
  }
});
