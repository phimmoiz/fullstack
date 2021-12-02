import mongoose from "mongoose";
import Episode from "./episode.model";
import Movie from "./movie.model";

const seasonSchema = new mongoose.Schema({
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
});

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

    movie.seasons.push(season._id);
    await movie.save();
    next();
  } catch (error) {
    next(error);
  }
});

const Season = mongoose.model("season", seasonSchema);

export default Season;
