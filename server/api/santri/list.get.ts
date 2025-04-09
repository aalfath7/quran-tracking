import { defineEventHandler } from "h3";
import { Santri } from "~/server/models/Santri";
import User from "~/server/models/User";

export default defineEventHandler(async () => {
  try {
    const santriList = await Santri.find()
      .populate({
        path: "halaqoh",
        model: "Halaqoh",
        populate: {
          path: "guru",
          model: User,
          select: "name",
        },
      })
      .lean();

    return {
      success: true,
      data: santriList,
    };
  } catch (error) {
    console.error("Error fetching santri list:", error);
    return {
      success: false,
      message: "Gagal mengambil data santri.",
    };
  }
});
