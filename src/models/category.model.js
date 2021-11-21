import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  movies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie",
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

const Category = mongoose.model("category", categorySchema);

export default Category;
