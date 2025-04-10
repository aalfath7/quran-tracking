import { defineEventHandler } from "h3";
import { Halaqoh } from "~/server/models/Halaqoh";
import { Santri } from "~/server/models/Santri";

export default defineEventHandler(async () => {
  try {
    const halaqohList = await Halaqoh.find().populate("guru", "name");

    const enrichedHalaqoh = await Promise.all(
      halaqohList.map(async (h) => {
        const santri = await Santri.find({ halaqoh: h._id });
        return {
          _id: h._id,
          nama: h.nama,
          guru: h.guru,
          santri,
        };
      })
    );

    return {
      success: true,
      data: enrichedHalaqoh,
    };
  } catch (err) {
    console.error("Gagal ambil list halaqoh beserta santri:", err);
    return {
      success: false,
      message: "Gagal mengambil data.",
    };
  }
});
