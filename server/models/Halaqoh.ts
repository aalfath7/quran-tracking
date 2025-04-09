import mongoose from "mongoose";
const { Schema } = mongoose;

const halaqohSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  guru: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Halaqoh =
  mongoose.models.Halaqoh || mongoose.model("Halaqoh", halaqohSchema);
