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
    const guruId = decoded.id;

    // 1. Ambil semua halaqoh milik guru
    const halaqohList = await Halaqoh.find({ guru: guruId });

    // 2. Ambil semua santri dari halaqoh tersebut
    const halaqohIds = halaqohList.map((h) => h._id);
    const santriList = await Santri.find({ halaqoh: { $in: halaqohIds } });

    // 3. Hitung total setoran dan bulan ini untuk setiap santri
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
          halaqohId: santri.halaqohId,
          totalSetoran,
          bulanIni,
        };
      })
    );

    return {
      success: true,
      data: enrichedSantri,
    };
  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
    return { success: false, message: "Terjadi kesalahan saat ambil data." };
  }
});
