// server/models/Santri.ts
import mongoose from "mongoose";

const santriSchema = new mongoose.Schema({
  nama: String,
  kelas: String,
});

export default mongoose.models.Santri || mongoose.model("Santri", santriSchema);
