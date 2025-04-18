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
    const jenis = (query.jenis as string)?.trim() || "semua";
    const skip = (page - 1) * limit;

    // Build filter search
    const searchFilter = search
      ? { nama: { $regex: search, $options: "i" } }
      : {};

    const totalSantri = await Santri.countDocuments(searchFilter);
    const santriList = await Santri.find(searchFilter).skip(skip).limit(limit);

    const result = await Promise.all(
      santriList.map(async (santri) => {
        const setoranFilter: any = { santri: santri._id };

        if (jenis !== "semua") {
          setoranFilter.jenis = jenis;
        }

        let setorans = await Setoran.find({ santri: santri._id }).sort({
          tanggal: -1,
        });

        // Ganti jenis undefined/null jadi "ziyadah"
        setorans = setorans.map((s) => {
          if (!s.jenis) s.jenis = "ziyadah";
          return s;
        });

        // Setelah diberi jenis default, filter sesuai parameter jika ada
        if (jenis !== "semua") {
          setorans = setorans.filter((s) => s.jenis === jenis);
        }

        if (setorans.length === 0) {
          return null;
        }

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
          jenis: setorans[0]?.jenis || "ziyadah",
        };
      })
    );

    // Filter yang null (karena tidak punya setoran sesuai jenis)
    const filteredResult = result.filter((item) => item !== null);

    // Urutkan berdasarkan totalHalaman
    filteredResult.sort((a, b) => b.totalHalaman - a.totalHalaman);

    return {
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalSantri / limit), // ini tetap dihitung dari totalSantri, bukan filteredResult.length
      totalSantri,
      data: filteredResult,
    };
  } catch (error) {
    console.error("Gagal mengambil data setoran:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
    };
  }
});
