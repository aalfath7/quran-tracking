import { defineEventHandler, getCookie } from "h3";
import { Setoran } from "~/server/models/Setoran";
import { Santri } from "~/server/models/Santri";
import { Halaqoh } from "~/server/models/Halaqoh";
import { connectToDB } from "~/server/utils/mongoose";
import jwt from "jsonwebtoken";
import User from "~/server/models/User"; // Ganti dari Guru ke User

export default defineEventHandler(async (event) => {
  try {
    await connectToDB();

    const token = getCookie(event, "token");
    if (!token) {
      return { success: false, message: "Token tidak ditemukan." };
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    const guruId = decoded.id;

    // Ambil data user dengan role guru
    const guru = await User.findById(guruId).select("name role");
    if (!guru || guru.role !== "guru") {
      return {
        success: false,
        message: "Guru tidak valid atau tidak ditemukan.",
      };
    }

    // Ambil semua halaqoh milik guru
    const halaqohList = await Halaqoh.find({ guru: guruId }).select("_id");
    const halaqohIds = halaqohList.map((h) => h._id);

    // Ambil semua santri dari halaqoh milik guru
    const santriList = await Santri.find({ halaqoh: { $in: halaqohIds } });

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
      namaGuru: guru.name, // tampilkan nama guru dari User model
      totalSantri: result.length,
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
