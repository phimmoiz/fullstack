import mongoose from "mongoose";
import Season from "./seasonModel";
import { isUrl } from "../../utils";

const episodeSchema = new mongoose.Schema(
  {
    title: {
      // Tập 4
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    lastUpdate: {
      type: Date,
      required: true,
      default: Date.now,

      // set last update to now when ever the episode is updated
      set: function (v) {
        return new Date();
      },
    },

    serverFshare: {
      type: String,
    },

    serverVimeo: {
      type: String,
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

episodeSchema.index({ title: 1, season: 1 }, { unique: true });

episodeSchema.pre("update", function (next) {
  this.lastUpdate = new Date();
  next();
});

episodeSchema.virtual("slug").get(function () {
  //convert title to slug
  return this.title.toLowerCase().replace(/ /g, "-").toLowerCase();
});

// push episode to season
episodeSchema.pre("save", async function (next) {
  this.lastUpdate = new Date();

  const season = await Season.findById(this.season);

  if (season) {
    // check if episode is already in season
    season.episodes.push(this._id);
    season.save();
  }
  next();
});

episodeSchema.pre("remove", function (next) {
  try {
    Season.updateMany(
      { episodes: this._id },
      { $pull: { episodes: this._id } }
    );
  } catch (error) {
    next(error);
  }
  next();
});

const Episode = mongoose.model("episode", episodeSchema);

export default Episode;
