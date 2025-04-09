import mongoose from "mongoose";
const { Schema } = mongoose;

const santriSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  kelas: {
    type: String,
    required: true,
  },
  halaqohId: {
    type: Schema.Types.ObjectId,
    ref: "Halaqoh",
    required: true,
  },
});

export const Santri =
  mongoose.models.Santri || mongoose.model("Santri", santriSchema);
