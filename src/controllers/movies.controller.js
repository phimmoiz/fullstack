import Movie from "../models/movie.model";
import Category from "../models/category.model";
import createError from "http-errors";

export const getMovies = async (req, res, next) => {
  // page
  const page = req.query.page || 1;
  // limit
  const limit = req.query.limit || 10;

  try {
    const movies = await Movie.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "categories",
        model: Category,
      });

    //set nextPage as link to next page as current domain
    res.json({
      success: true,
      data: movies,
      length: movies.length,
      nextPage: `${req.protocol}://${req.get("host")}/movies?page=${
        page + 1
      }&limit=${limit}`,
    });
  } catch (error) {
    next(createError(error));
  }
};

export const getMovie = async (req, res) => {
  try {
    const { slug } = req.params;

    const movie = await Movie.findOne({ slug }).populate({
      path: "categories",
      model: Category,
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    res.render("movie", { movie });
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const createMovie = async (req, res) => {
  console.log(req.body);

  try {
    const {
      title,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
    } = req.body;

    // create movie with mongoose
    const newMovie = await Movie.create({
      title,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
    });

    console.log(newMovie);
    // res.json({ success: true, data: newCat });

    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// update movie base on id provided
export const updateMovie = async (req, res) => {
  try {
    const {
      title,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
    } = req.body;

    const { id } = req.params;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        image,
        time,
        trailer,
        premiere,
        description,
        releaseYear,
        rating,
        imdbId,
        slug,
        categories,
      },
      { new: true }
    );

    res.json({ success: true, data: updatedMovie });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
