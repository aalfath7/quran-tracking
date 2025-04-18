import { connectToDB } from "~/server/utils/mongoose";
import { Halaqoh } from "~/server/models/Halaqoh";

export default defineEventHandler(async () => {
  try {
    await connectToDB();

    const halaqoh = await Halaqoh.find().populate("guru", "name");

    return {
      success: true,
      data: halaqoh,
    };
  } catch (error) {
    console.error("❌ Gagal mengambil data halaqoh:", error);
    return {
      success: false,
      message: "Gagal mengambil data halaqoh",
    };
  }
});
