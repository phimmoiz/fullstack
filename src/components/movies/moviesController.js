import Movie from "./movieModel";
import User from "../auth/userModel";
import Category from "./categoryModel";
import Season from "./seasonModel";
import Episode from "./episodeModel";
import Comment from "./commentModel";

import createError from "http-errors";
import {
  getNewMovies,
  getMovieWithOneEpisode,
  increaseViewCount,
} from "./moviesService";

// Routing
export const getMovies = async (req, res, next) => {
  // page
  const page = parseInt(req.query.page) || 1;
  // limit
  const limit = req.query.limit || 10;
  // by name
  const matchName = req.query.matchName || "";
  // by category
  const categorySlugs = req.query.categorySlugs || [];

  try {
    const movies = await getNewMovies({
      page: page,
      limit,
      matchName,
      categorySlugs,
    });

    //set nextPage as link to next page as current domain
    res.json({
      success: true,
      data: movies,
      page: page,
      length: movies.length,
      nextPage: `${req.protocol}://${req.get("host")}/api/movies?page=${page + 1
        }&limit=${limit}&matchName=${matchName}`,
    });
  } catch (error) {
    next(createError(error));
  }
};

export const getTopMovies = async (req, res, next) => {
  // page
  const page = req.query.page || 1;
  // limit
  const limit = req.query.limit || 10;

  try {
    const movies = await getNewMovies({
      page,
      limit,
      sortByDate: false,
      sortByViews: true,
    });

    //set nextPage as link to next page as current domain
    res.json({
      success: true,
      data: movies,
      length: movies.length,
      nextPage: `${req.protocol}://${req.get("host")}/movies?page=${page + 1
        }&limit=${limit}`,
    });
  } catch (error) {
    next(createError(error));
  }
};

export const getSingleMovie = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const success = req.session?.success;

    const movie = await Movie.findOne({ slug })
      .populate({
        path: "categories",
        model: Category,
      })
      .populate({
        path: "seasons",
        model: Season,
        populate: {
          path: "episodes",
          model: Episode,
        },
      });

    if (!movie) {
      throw new Error("Movie not found");
    }

    let isFavorite = false;
    if (res.locals.user) {
      const user = await User.findById(res.locals.user.id);
      isFavorite = user.favorites.some(
        (movieId) => movieId.toString() === movie._id.toString()
      );
    }

    // Increase view count
    increaseViewCount(movie._id);

    // get comments
    // const comments = Comment.find({ movie: movie._id }).populate({
    //   path: "user",
    //   model: User,
    // });

    // pagination for comments
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(5);
    const start = (page - 1) * limit;
    const comments = Comment.find({ movie: movie._id }).skip(start).limit(limit).populate({
      path: "user",
      model: User,
    }).sort({ createdAt: -1 });
    const commentCount = await Comment.countDocuments({ movie: movie._id });
    // total pages
    const totalPages = Math.ceil(commentCount / limit);
    const pagination = Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (page) => {
        return {
          url: `/movies/${movie.slug}?page=${page}`,
          number: page,
        }
      });
    // new movies
    const newSingleMovies = getMovieWithOneEpisode({ page: 1, limit: 10 });
    const randomMovies = getNewMovies({ page: 1, limit: 10 });

    const [commentsResolved, randomMoviesResolved, newSingleMoviesResolved] =
      await Promise.all([comments, randomMovies, newSingleMovies]);

    res.render("movies/views/movies/single-movie", {
      title: movie.title,
      movie,
      newSingleMovies: newSingleMoviesResolved,
      randomMovies: randomMoviesResolved,
      isFavorite,
      comments: commentsResolved,
      success,
      pagination,
      currentIndex: page - 1,
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    next(createError(404, err.message));
  }
};

export const getSeason = async (req, res) => {
  try {
    const { slug, season } = req.params;

    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    const seasonData = movie.seasons.find((s) => s.number === season);

    if (!seasonData) {
      throw new Error("Season not found");
    }

    res.render("season", { movie, seasonData });
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const getEpisode = async (req, res, next) => {
  try {
    const { slug, season, episode } = req.params;

    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    const seasonData = movie.seasons.find((s) => s.slug === season);

    if (!seasonData) {
      throw new Error("Season not found");
    }

    const episodeData = seasonData.episodes.find((e) => e.slug === episode);

    if (!episodeData) {
      throw new Error("Episode not found");
    }
    
    const vimeoId = episodeData.serverVimeo.split("/")[3];

    const video = "https://player.vimeo.com/video/" + vimeoId;

    res.render("movies/views/movies/episode", {
      movie,
      season: seasonData,
      episode: episodeData,
      video,
    });
    
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const postMovie = async (req, res) => {
  // console.log(req.body);

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
      englishTitle,
    } = req.body;

    // create movie with mongoose
    const newMovie = await Movie.create({
      title,
      englishTitle,
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

    // console.log(newMovie);
    // res.json({ success: true, data: newCat });

    req.flash("success", `${title} - ${englishTitle} has been added`);

    res.redirect("/admin/movies");
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

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

export const getMovieByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const movies = await Movie.find({ categories: slug }).populate({
      path: "categories",
      model: Category,
    });

    res.json({ success: true, data: movies });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const editMovie = async (req, res) => {
  try {
    // check if method put
    if (req.body._method !== "PUT") {
      return;
    }
    const { slug } = req.params;
    // Get Data from body
    const {
      description,
      title,
      image,
      time,
      trailer,
      premiere,
      releaseYear,
      rating,
      imdbId,
      englishTitle,
    } = req.body;

    let query = {
      description,
      title,
      image,
      time,
      trailer,
      premiere,
      releaseYear,
      rating,
      imdbId,
      englishTitle,
    };

    // edit movie in db
    await Movie.findOneAndUpdate({ slug }, query, {
      new: true,
    });

    res.redirect("/movies/" + slug);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/movies/");
  }
};

export const deleteMovie = async (req, res) => {
  try {
    if (req.body._method !== "DELETE") {
      return;
    }
    const { slug } = req.params;
    const movie = await Movie.findOne({ slug });

    await Movie.findByIdAndDelete(movie._id);

    res.redirect("/admin/movies");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/movies");
  }
};
