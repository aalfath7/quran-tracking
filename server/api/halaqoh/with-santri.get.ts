import { defineEventHandler, getCookie } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";
import { Santri } from "~/server/models/Santri";
import User from "~/server/models/User";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "token");

    if (!token) {
      return { success: false, message: "Token tidak ditemukan." };
    }

    // ✅ Decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");

    const guruId = decoded.id; // Sesuai dengan isi di jwt.sign()

    // ✅ Ambil hanya halaqoh milik guru ini
    const halaqohList = await Halaqoh.find({ guru: guruId }).populate(
      "guru",
      "nama"
    );

    const enrichedHalaqoh = await Promise.all(
      halaqohList.map(async (h) => {
        const santri = await Santri.find({ halaqoh: h._id });
        const guru = await User.find({ _id: guruId }).select("name");
        return {
          _id: h._id,
          nama: h.nama,
          guru: guru[0].name,
          santri,
        };
      })
    );

    return {
      success: true,
      data: enrichedHalaqoh,
    };
  } catch (err) {
    console.error("Gagal ambil halaqoh:", err);
    return { success: false, message: "Gagal mengambil data." };
  }
});
