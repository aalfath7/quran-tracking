import mongoose from "mongoose";
const { Schema } = mongoose;

const setoranSchema = new Schema(
  {
    santri: {
      type: Schema.Types.ObjectId,
      ref: "Santri",
      required: true,
    },
    guru: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    surat: {
      type: String,
      required: true,
    },
    ayat: {
      type: String,
      required: true,
    },
    jumlahHalaman: {
      type: Number,
      required: true,
    },
    catatan: {
      type: String,
    },
    jenis: {
      type: String,
      enum: ["murojaah", "ziyadah"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Setoran =
  mongoose.models.Setoran || mongoose.model("Setoran", setoranSchema);
