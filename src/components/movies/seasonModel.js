import mongoose from "mongoose";
import Episode from "./episodeModel";
import Movie from "./movieModel";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // max length 20
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

seasonSchema.index({ name: 1, movie: 1 }, { unique: true });

seasonSchema.virtual("slug").get(function () {
  return this.name.replace(/\s+/g, "-").toLowerCase();
});

seasonSchema.pre("remove", async function (next) {
  //remove from movie
  const movie = await Movie.findById(this.movie);
  movie.seasons = movie.seasons.filter(
    (season) => season.toString() !== this._id.toString()
  );
  await movie.save();
});

seasonSchema.pre("remove", async function (next) {
  try {
    await Episode.deleteMany({ season: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

//oncreate
seasonSchema.post("save", async function (season, next) {
  try {
    const movie = await Movie.findById(season.movie);

    // check if season is already in movie
    if (movie.seasons.indexOf(season._id) === -1) {
      movie.seasons.push(season._id);
      await movie.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Season = mongoose.model("season", seasonSchema);

export default Season;
