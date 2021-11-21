import mongoose from "mongoose";
import Category from "./category.model";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseYear: {
    type: Number,
    required: true,
    // validate releaseYear to be integer, greater than 1900 and less than 2100
    validate: {
      validator: function (releaseYear) {
        return releaseYear > 1900 && releaseYear < 2100;
      },
    },
  },
  rating: {
    type: Number,
  },
  imdbId: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

// set pre save for movieSchema
movieSchema.pre("save", async function (next) {
  // update category

  console.log("categories", this.categories);
  if (this.categories) {
    this.categories.forEach(async (category) => {
      // add movie to category if not exist
      const cat = await Category.findById(category);

      if (!cat.movies.includes(this._id)) {
        cat.movies.push(this._id);
        cat.save();
      }

      console.log(cat);
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
