import { defineEventHandler, getCookie } from "h3";
import jwt from "jsonwebtoken";
import { connectToDB } from "~/server/utils/mongoose";
import { Setoran } from "~/server/models/Setoran";
import { Santri } from "~/server/models/Santri";

export default defineEventHandler(async (event) => {
  try {
    // ✅ Hubungkan ke DB
    await connectToDB();

    // ✅ Ambil token dari cookie
    const token = getCookie(event, "token");
    if (!token) {
      return { success: false, message: "Token tidak ditemukan." };
    }

    // ✅ Decode token untuk ambil id guru
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    const guruId = decoded.id; // ID guru diambil dari token

    // ✅ Ambil semua setoran berdasarkan guruId
    const setoranList = await Setoran.find({ guru: guruId });

    // ✅ Jika setoranList kosong
    if (setoranList.length === 0) {
      return {
        success: false,
        message: "Tidak ada setoran ditemukan untuk guru ini.",
      };
    }

    // ✅ Ambil data santri berdasarkan setoran
    const santriIds = setoranList.map((s) => s.santri);
    const santriList = await Santri.find({ _id: { $in: santriIds } });

    // ✅ Buat map untuk akses cepat data santri berdasarkan ID
    const santriMap = santriList.reduce((acc: any, santri: any) => {
      acc[santri._id.toString()] = santri.nama; // Menyimpan nama santri
      return acc;
    }, {});

    // ✅ Menghitung total halaman dan rata-rata halaman per santri
    const rataRataSetoran = setoranList.reduce((acc: any, setoran: any) => {
      const santriId = setoran.santri.toString();
      if (!acc[santriId]) {
        acc[santriId] = { totalHalaman: 0, countSetoran: 0 };
      }
      acc[santriId].totalHalaman += setoran.jumlahHalaman;
      acc[santriId].countSetoran += 1;
      return acc;
    }, {});

    // ✅ Hitung rata-rata halaman per santri dan ambil nama santri
    const rataRata = Object.keys(rataRataSetoran).map((santriId: string) => {
      const { totalHalaman, countSetoran } = rataRataSetoran[santriId];
      return {
        santriId,
        nama: santriMap[santriId], // Tambahkan nama santri
        rataRataHalaman: countSetoran > 0 ? totalHalaman / countSetoran : 0,
      };
    });

    return {
      success: true,
      data: rataRata,
    };
  } catch (err) {
    console.error("Gagal hitung rata-rata setoran:", err);
    return { success: false, message: "Terjadi kesalahan." };
  }
});
