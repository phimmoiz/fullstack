import mongoose from "mongoose";

const filmSchema = new mongoose.Schema({
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
  // category: {
  //   //
  //   type: String,
});

const Film = mongoose.model("Film", filmSchema);

export default Film;
