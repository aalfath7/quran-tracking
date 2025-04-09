import { defineEventHandler } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";

export default defineEventHandler(async () => {
  try {
    const halaqohList = await Halaqoh.find().populate("guru", "name"); // hanya ambil nama guru

    return {
      success: true,
      data: halaqohList,
    };
  } catch (err) {
    console.error("Gagal ambil list halaqoh:", err);
    return {
      success: false,
      message: "Gagal mengambil daftar halaqoh.",
    };
  }
});
