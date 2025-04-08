import { connectToDB } from "~/server/utils/mongoose";
import Setoran from "~/server/models/Setoran";

export default defineEventHandler(async (event) => {
  await connectToDB();

  const query = getQuery(event);
  const { guruId } = query;

  const filter: any = {};
  if (guruId) {
    filter.guru = guruId;
  }

  const setorans = await Setoran.find(filter).populate("guru", "username");

  return setorans;
});
