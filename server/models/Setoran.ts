// server/models/Setoran.ts
import mongoose from "mongoose";

const setoranSchema = new mongoose.Schema(
  {
    santriId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surat: String,
    ayat: String,
    nilai: Number,
    catatan: String,
    tanggal: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "diterima", "ditolak"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setoran ||
  mongoose.model("Setoran", setoranSchema);
