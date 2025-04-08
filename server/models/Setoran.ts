import mongoose from "mongoose";

const setoranSchema = new mongoose.Schema({
  guru: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama_santri: { type: String, required: true },
  surat: { type: String, required: true },
  ayat: { type: String, required: true },
  tanggal: { type: Date, default: Date.now },
  nilai: { type: Number, min: 0, max: 100 },
  catatan: { type: String },
});

export default mongoose.models.Setoran ||
  mongoose.model("Setoran", setoranSchema);
