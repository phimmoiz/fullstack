import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  rating: {
    type: Number,
  },
  imdbId: {
    type: String,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

// set pre save for movieSchema
movieSchema.pre("save", function (next) {
  // update category
  if (this.categories) {
    this.categories.forEach((category) => {
      // add movie to category if not exist
      if (!category.movies.includes(this._id)) {
        category.movies.push(this._id);
      }
    });
  }
  next();
});

// delete from category if movie is deleted
movieSchema.pre("remove", function (next) {
  // update category
  if (this.categories) {
    this.categories.forEach((category) => {
      // remove movie from category
      category.movies.pull(this._id);
    });
  }
  next();
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
