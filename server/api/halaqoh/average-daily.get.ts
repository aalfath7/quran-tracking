import { defineEventHandler, getCookie, H3Event } from "h3";
import jwt from "jsonwebtoken";
import { connectToDB } from "~/server/utils/mongoose";
import { Setoran } from "~/server/models/Setoran";

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

interface RataRataPerTanggal {
  tanggal: string;
  rataRataHalaman: number;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    await connectToDB();

    const token = getCookie(event, "token");
    if (!token) {
      return { success: false, message: "Token tidak ditemukan." };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as DecodedToken;
    const guruId = decoded.id;

    // Ambil semua setoran guru
    const setoranList = await Setoran.find({ guru: guruId });

    if (setoranList.length === 0) {
      return {
        success: false,
        message: "Tidak ada setoran ditemukan untuk guru ini.",
      };
    }

    // Group dan hitung rata-rata per tanggal
    const dataPerTanggal: Record<
      string,
      { totalHalaman: number; count: number }
    > = {};

    setoranList.forEach((setoran: any) => {
      const tanggalStr = new Date(setoran.tanggal).toISOString().split("T")[0];

      if (!dataPerTanggal[tanggalStr]) {
        dataPerTanggal[tanggalStr] = { totalHalaman: 0, count: 0 };
      }

      dataPerTanggal[tanggalStr].totalHalaman += setoran.jumlahHalaman;
      dataPerTanggal[tanggalStr].count += 1;
    });

    // Ubah ke array
    const hasil: RataRataPerTanggal[] = Object.entries(dataPerTanggal).map(
      ([tanggal, { totalHalaman, count }]) => ({
        tanggal,
        rataRataHalaman: count > 0 ? totalHalaman / count : 0,
      })
    );

    // Urutkan berdasarkan tanggal
    hasil.sort(
      (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    );

    return {
      success: true,
      data: hasil,
    };
  } catch (err) {
    console.error("Gagal hitung rata-rata per tanggal:", err);
    return { success: false, message: "Terjadi kesalahan." };
  }
});
