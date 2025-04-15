import { defineEventHandler, getQuery } from "h3";
import { Setoran } from "~/server/models/Setoran";
import { Santri } from "~/server/models/Santri";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  try {
    await connectToDB();

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = (query.search as string)?.trim() || "";
    const skip = (page - 1) * limit;

    // Build filter search
    const searchFilter = search
      ? { nama: { $regex: search, $options: "i" } } // 'i' untuk case-insensitive
      : {};

    const totalSantri = await Santri.countDocuments(searchFilter);
    const santriList = await Santri.find(searchFilter).skip(skip).limit(limit);

    const result = await Promise.all(
      santriList.map(async (santri) => {
        const setorans = await Setoran.find({ santri: santri._id }).sort({
          tanggal: -1,
        });

        const totalHalaman = setorans.reduce(
          (acc, setoran) => acc + (setoran.jumlahHalaman || 0),
          0
        );

        const hafalanTerakhir = setorans[0]
          ? `${setorans[0].surat} : ${setorans[0].ayat}`
          : "-";

        const bulanIni = setorans.filter((setoran) => {
          const tgl = new Date(setoran.tanggal);
          const now = new Date();
          return (
            tgl.getMonth() === now.getMonth() &&
            tgl.getFullYear() === now.getFullYear()
          );
        }).length;

        return {
          _id: santri._id,
          nama: santri.nama,
          kelas: santri.kelas,
          totalHalaman,
          hafalanTerakhir,
          bulanIni,
        };
      })
    );

    // Urutkan berdasarkan totalHalaman
    result.sort((a, b) => b.totalHalaman - a.totalHalaman);

    return {
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalSantri / limit),
      totalSantri,
      data: result,
    };
  } catch (error) {
    console.error("Gagal mengambil data setoran:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
    };
  }
});
