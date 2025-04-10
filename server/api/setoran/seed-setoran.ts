// server/api/seed-setoran.ts
import { defineEventHandler } from "h3";
import mongoose from "mongoose";
import { Setoran } from "~/server/models/Setoran";

// Buat ObjectId
const santriId = new mongoose.Types.ObjectId("67f70b317a575af74855e9f4");
const guruId = new mongoose.Types.ObjectId("67f5b0437cbb1349f09250d8");

const suratList = [
  "Al-Fatihah",
  "Al-Baqarah",
  "Ali 'Imran",
  "An-Nisa'",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
];

export default defineEventHandler(async () => {
  const now = new Date();
  const bulkData = [];

  for (let i = 0; i < 30; i++) {
    const tanggal = new Date();
    tanggal.setDate(now.getDate() - i);

    const surat = suratList[i % suratList.length];
    const ayat = `${Math.floor(Math.random() * 20) + 1} - ${
      Math.floor(Math.random() * 40) + 20
    }`;

    bulkData.push({
      santri: santriId,
      guru: guruId,
      tanggal,
      surat,
      ayat,
      catatan: "Disetorkan dengan baik",
    });
  }

  try {
    const result = await Setoran.insertMany(bulkData);
    return {
      success: true,
      message: `${result.length} dummy setoran inserted.`,
    };
  } catch (err: any) {
    console.error("Insert error:", err);
    return {
      success: false,
      message: err.message || "Failed to insert dummy setoran.",
    };
  }
});
