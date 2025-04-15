// server/api/setoran/chart.ts
import { defineEventHandler } from "h3";
import { connectToDB } from "~/server/utils/mongoose";
import { Setoran } from "~/server/models/Setoran";
import { Santri } from "~/server/models/Santri";

export default defineEventHandler(async () => {
  await connectToDB();

  const santriList = await Santri.find();

  const chartData = await Promise.all(
    santriList.map(async (santri) => {
      const setorans = await Setoran.find({ santri: santri._id }).sort({
        tanggal: 1,
      });

      const perTanggal: Record<string, number> = {};
      setorans.forEach((setoran) => {
        const tgl = new Date(setoran.tanggal).toISOString().split("T")[0]; // format yyyy-mm-dd
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
