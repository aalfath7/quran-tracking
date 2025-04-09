import { connectToDB } from "~/server/utils/mongoose";
import { Setoran } from "~/server/models/Setoran";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const result = await Setoran.aggregate([
    {
      $group: {
        _id: "$surat",
        total: { $sum: 1 },
        rataNilai: { $avg: "$nilai" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result;
});
