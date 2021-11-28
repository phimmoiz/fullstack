import mongoose from "mongoose";
import Episode from "./episode.model";

const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
});

seasonSchema.pre("remove", async function (next) {
  try {
    await this.model("Episode").deleteMany({ season: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Season = mongoose.model("season", seasonSchema);

export default Season;
