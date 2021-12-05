import Movie from "./movie.model";
import Season from "./season.model";
import Episode from "./episode.model";
import Category from "./category.model";

// Mongoose interaction
export const getNewMovies = async ({
  page = 1,
  limit = 10,
  categorySlugs = [],
  sortByDate = true,
  sortByViews = false,
  lean = false,
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
    .lean(lean)
    .exec();

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
