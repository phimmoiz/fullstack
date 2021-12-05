import Category from "../movies/category.model";
import Movie from "../movies/movie.model";
import User from "../auth/user.model";
import Season from "../movies/season.model";
import Episode from "../movies/episode.model";
import createError from "http-errors";

export const getAdmin = async (req, res, next) => {
  try {
    // get user count, category count, movie count
    const [users, categories, movies] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Movie.countDocuments(),
    ]);

    res.render("auth/views/admin/index", {
      title: "Admin",
      count: { users, categories, movies },
    });
  } catch (error) {
    next(createError(500));
  }
};

export const getAdminPanel = async (req, res) => {
  // get all users
  const users = await User.find({});

  res.render("auth/views/admin/users", { title: "Admin", users });
};

// Movie panel
export const moviePanelGetIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const error = req.session?.error;
  const success = req.session?.success;

  // get all movies, sort, and populate all
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "categories",
      model: Category,
    });

  const categories = await Category.find({});

  // get movie count
  const movieCount = await Movie.countDocuments();

  // get total pages
  const totalPages = Math.ceil(movieCount / 10);

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1).map(
    (page) => {
      return {
        url: `movies?page=${page}`,
        number: page,
      };
    }
  );

  res.render("auth/views/admin/movies", {
    title: "Admin",
    movies,
    movieCount,
    categories,
    pagination,
    error,
    success,
    currentIndex: page - 1,
    currentPage: page,
  });
};

export const moviePanelGetMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    if (!movie) throw new Error("Movie not found");

    res.render("auth/views/admin/movies", {
      title: "Admin",
      movie,
    });
  } catch (err) {
    res.redirect("/admin/movies");
  }
};

export const moviePanelEditSeason = async (req, res) => {
  try {
    const { slug, seasonSlug } = req.params;

    const { _id: movieId } = await Movie.findOne({ slug });

    const season = await Season.findOne({
      slug: seasonSlug,
      movie: movieId,
    }).populate({
      path: "episodes",
      model: Episode,
    });

    if (!season) throw new Error("Season not found");

    // res.json({ success: true, season });
    res.render("auth/views/admin/season", {
      title: "Admin",
      season,
    });
  } catch (err) {
    res.json({ success: false, err });
  }
};

export const moviePanelEditMovie = async (req, res) => {
  const { slug } = req.params;

  try {
    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    //get all categories
    const categories = await Category.find({});

    if (!movie) throw new Error("Movie not found");

    res.render("auth/views/admin/movie-edit", {
      title: "Admin",
      movie,
      categories,
    });
  } catch (err) {
    req.session.error = err.message;
    res.redirect("/admin/movies");
  }
};

export const moviePanelPostMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });

    if (!movie) throw new Error("Movie not found");

    const { title, description, year, rating, duration, trailer } = req.body;

    await Movie.findByIdAndUpdate(movie._id, {
      title,
      description,
      year,
      rating,
      duration,
      trailer,
    });

    res.render("auth/views/admin/movies", {
      title: "Admin",
      movie,
      success: "Movie updated successfully",
    });
  } catch (err) {
    res.redirect("/admin/movies");
  }
};

export const getCategoriesPanel = async (req, res) => {
  // get all categories
  const categories = await Category.find({});

  res.render("auth/views/admin/categories", { title: "Admin", categories });
};

export const getUserPanel = async (req, res) => {
  // get all users
  const users = await User.find({});

  res.render("auth/views/admin/users", { title: "Admin", users });
};
