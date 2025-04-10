import { defineEventHandler } from "h3";
import { Setoran } from "~/server/models/Setoran";

export default defineEventHandler(async () => {
  try {
    const averagePerDay = await Setoran.aggregate([
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$tanggal" },
            },
          },
          count: { $sum: 1 }, // total jumlah setoran per hari
        },
      },
      {
        $project: {
          date: "$_id.date",
          average: "$count", // anggap average = total setoran per hari
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return {
      success: true,
      data: averagePerDay,
    };
  } catch (error) {
    console.error("Failed to calculate daily averages:", error);
    return {
      success: false,
      message: "Error retrieving daily average setoran data.",
    };
  }
});
