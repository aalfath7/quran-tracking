// server/api/admin/user/index.ts

import { defineEventHandler } from "h3";
import User from "~/server/models/User";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();

  try {
    const guruList = await User.find({ role: "guru" }).select("name");

    return {
      success: true,
      data: guruList,
    };
  } catch (error) {
    console.error("Gagal mengambil data guru:", error);
    return {
      success: false,
      message: "Gagal mengambil data guru.",
    };
  }
});
