import { defineEventHandler, getCookie } from "h3";
import { jwtDecode } from "jwt-decode";
import { Halaqoh } from "~/server/models/Halaqoh";
import { Santri } from "~/server/models/Santri";
import { Setoran } from "~/server/models/Setoran";
import { connectToDB } from "~/server/utils/mongoose";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const token = getCookie(event, "token");
  if (!token) {
    return { success: false, message: "Token tidak ditemukan." };
  }

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.role; // admin / guru — hanya sebagai referensi

    // ✅ Ambil semua santri tanpa filter berdasarkan guru
    const santriList = await Santri.find({});

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const enrichedSantri = await Promise.all(
      santriList.map(async (santri) => {
        const totalSetoran = await Setoran.countDocuments({
          santri: santri._id,
        });
        const bulanIni = await Setoran.countDocuments({
          santri: santri._id,
          tanggal: { $gte: firstOfMonth },
        });

        return {
          _id: santri._id,
          nama: santri.nama,
          kelas: santri.kelas,
          halaqohId: santri.halaqoh,
          totalSetoran,
          bulanIni,
        };
      })
    );

    // ✅ Data grafik setoran per bulan
    const grafikSetoran = await Setoran.aggregate([
      {
        $group: {
          _id: {
            tahun: { $year: "$tanggal" },
            bulan: { $month: "$tanggal" },
          },
          jumlah: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.tahun": 1, "_id.bulan": 1 },
      },
    ]);

    return {
      success: true,
      data: enrichedSantri,
      grafik: grafikSetoran.map((item) => ({
        bulan: `${item._id.bulan}/${item._id.tahun}`,
        jumlah: item.jumlah,
      })),
    };
  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
    return { success: false, message: "Terjadi kesalahan saat ambil data." };
  }
});
