import mongoose from "mongoose";

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
});

// Remove category from movie reference to
categorySchema.pre("remove", async function (next) {
  try {
    await this.model("Movie").updateMany(
      { categories: this._id },
      { $pull: { categories: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Season = mongoose.model("season", seasonSchema);

export default Season;
