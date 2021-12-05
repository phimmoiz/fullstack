import Movie from "../models/movie.model";
import User from "../models/user.model";
import Category from "../models/category.model";
import Season from "../models/season.model";
import createError from "http-errors";
import Comment from "../models/comment.model";
// Mongoose interaction
export const getNewMovies = async ({
  page = 1,
  limit = 10,
  categorySlugs = [],
  sortByDate = true,
  sortByViews = false,
  lean = false,
  populate = false,
  matchName = "",
}) => {
  // set querystring for category
  let query = {};

  // get categories Id base on category slugs
  if (categorySlugs.length > 0) {
    const categories = await Category.find({ slug: { $in: categorySlugs } });
    const categoryIds = categories.map((category) => category._id);

    query = {
      categories: { $in: categoryIds },
    };
  }

  // set querystring for name
  if (matchName) {
    query = {
      ...query,
      // title and englishTitle
      $or: [
        { title: { $regex: matchName, $options: "i" } },
        { englishTitle: { $regex: matchName, $options: "i" } },
      ],
    };
  }

  console.log(query, limit);
  // console.log(await Movie.find(query).limit(parseInt(limit)));

  // populate if needed
  const movies = await Movie.find(query)
    .sort({
      // createdAt: sortByDate ? -1 : 1,
      _id: sortByDate ? -1 : 1,
      viewCount: sortByViews ? -1 : 1,
    })
    .limit(parseInt(limit))
    .skip((page - 1) * limit)
    .exec();
  // .lean(lean);

  // if (populate) {
  //   movies.populate({ path: "categories", model: Category });
  // }

  // const result = await movies.exec();

  // console.log(result);

  return movies;
};

export const getMovieWithOneEpisode = async (page = 1, limit = 10) => {
  // select movies with one season, season with one episode
  const movies = await Movie.find({ seasons: { $size: 1 } })
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Movie,
      },
    });

  return movies
    .filter((movie) => movie.seasons[0].episodes.length === 1)
    .slice(0, limit);
};

export const increaseViewCount = async (movieId) => {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw createError(404, "Movie not found");
  }

  movie.viewCount += 1;
  await movie.save();
};

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
          model: Movie,
        },
      })

      .lean();

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

    // get comments
    const comments = await Comment.find({ movie: movie._id }).populate({
      path: "user",
      model: User,
    });


    // Increase view count
    increaseViewCount(movie._id);

    res.render("movies/single-movie", {
      title: movie.title,
      movie,
      isFavorite,
      comments,
      success
    });
  } catch (err) {
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

export const getEpisode = async (req, res) => {
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

    const seasonData = movie.seasons.find((s) => s.number === season);

    if (!seasonData) {
      throw new Error("Season not found");
    }

    const episodeData = seasonData.episodes.find((e) => e.number === episode);

    if (!episodeData) {
      throw new Error("Episode not found");
    }

    res.render("episode", { movie, seasonData, episodeData });
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

    req.session.success2 = `${title} - ${englishTitle} has been added`;

    res.redirect("/admin/movies");
  } catch (err) {
    console.log(err);
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

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    res.json({ success: true, data: deletedMovie });
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
    const movie = await Movie.findOne({ slug });
    //res.json({ success: true, data: movie });
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
    console.log(req.body);
    let query = {};
    if (description) {
      query.description = description;
    }
    if (!title) {
      throw new Error("Not have title movie");
    } else {
      query.title = title;
    }
    if (!image) {
      throw new Error("Not have image url");
    } else {
      query.image = image;
    }
    if (!time) {
      throw new Error("Not have time of movie");
    } else {
      query.time = time;
    }
    if (!trailer) {
      throw new Error("Not have trailer url");
    } else {
      query.trailer = trailer;
    }

    if (!premiere) {
      throw new Error("Not have premiere date");
    } else {
      query.premiere = premiere;
    }

    if (!releaseYear) {
      throw new Error("Not have release year");
    } else {
      query.releaseYear = releaseYear;
    }
    if (rating) {
      query.rating = rating;
    }
    if (imdbId) {
      query.imdbId = imdbId;
    }
    if (!englishTitle) {
      throw new Error("Not have english title");
    } else {
      query.englishTitle = englishTitle;
    }
    // edit movie in db
    const updatedMovie = await Movie.findOneAndUpdate({ slug }, query, {
      new: true,
    });
    res.redirect("/movies/" + slug);
  } catch (err) {
    //console.log(err);
    //res.redirect("/");
    req.session.error = err.message;
    res.redirect("/admin/movies");
  }
};
