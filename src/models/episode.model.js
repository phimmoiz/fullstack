import mongoose from "mongoose";
import Season from "./season.model";
import { isUrl } from "../utils/";

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
    required: true,
    validate: {
      validator: isUrl,
      message: "Invalid URL",
    },
  },

  serverVimeo: {
    type: String,
    required: true,
    validate: {
      validator: isUrl,
      message: "Invalid URL",
    },
  },

  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
});

episodeSchema.pre("save", function (next) {
  this.lastUpdate = new Date();
  next();
});

episodeSchema.pre("update", function (next) {
  this.lastUpdate = new Date();
  next();
});

// push episode to season
episodeSchema.pre("save", async function (next) {
  const season = await Season.findById(this.season);

  if (season) {
    season.episodes.push(this._id);
    season.save();
  }
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
