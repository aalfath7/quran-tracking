import { defineEventHandler } from "h3";
import { Setoran } from "~/server/models/Setoran";

export default defineEventHandler(async () => {
  try {
    const hasil = await Setoran.aggregate([
      {
        $group: {
          _id: {
            bulan: { $month: "$tanggal" },
            tahun: { $year: "$tanggal" },
          },
          rataRataSetoran: { $avg: "$jumlah" },
        },
      },
      {
        $sort: { "_id.tahun": 1, "_id.bulan": 1 },
      },
    ]);

    const labels = hasil.map(
      (item: any) => `${item._id.bulan}/${item._id.tahun}`
    );
    const data = hasil.map((item: any) => item.rataRataSetoran);

    return {
      success: true,
      labels,
      data,
    };
  } catch (err) {
    console.error("Gagal ambil rata-rata:", err);
    return {
      success: false,
      message: "Gagal ambil data rata-rata.",
    };
  }
});
