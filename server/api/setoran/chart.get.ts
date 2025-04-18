// server/api/setoran/chart.ts
import { defineEventHandler, getQuery } from "h3";
import { connectToDB } from "~/server/utils/mongoose";
import { Setoran } from "~/server/models/Setoran";
import { Santri } from "~/server/models/Santri";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const query = getQuery(event);
  const jenis = (query.jenis as string)?.trim() || "semua";

  const santriList = await Santri.find();

  const chartData = await Promise.all(
    santriList.map(async (santri) => {
      // Ambil semua setoran dulu
      let setorans = await Setoran.find({ santri: santri._id }).sort({
        tanggal: 1,
      });

      // Ubah jenis null/undefined jadi 'ziyadah'
      setorans = setorans.map((s) => {
        s.jenis = s.jenis || "ziyadah";
        return s;
      });

      // Filter jika jenis bukan 'semua'
      if (jenis !== "semua") {
        setorans = setorans.filter((s) => s.jenis === jenis);
      }

      const perTanggal: Record<string, number> = {};
      setorans.forEach((setoran) => {
        const tgl = new Date(setoran.tanggal).toISOString().split("T")[0];
        if (!perTanggal[tgl]) perTanggal[tgl] = 0;
        perTanggal[tgl] += Number(setoran.jumlahHalaman || 0);
      });

      return {
        nama: santri.nama,
        data: perTanggal,
      };
    })
  );

  return {
    success: true,
    data: chartData,
  };
});
