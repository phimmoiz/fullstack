import Episode from "./episode.model";
import Movie from "./movie.model";
import Season from "./season.model";
import createError from "http-errors";

export const getEpisode = async (req, res, next) => {
  try {
    const episodeId = req.params.id;

    const episode = await Episode.findById(episodeId);

    if (!episode) {
      throw new Error("Episode not found");
    }

    return res.json(episode);
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const postEpisode = async (req, res, next) => {
  try {
    const { title, description, image, serverFshare, serverVimeo, season } =
      req.body;

    //create
    const episode = await Episode.create({
      title,
      description,
      image,
      serverFshare,
      serverVimeo,
      season,
    });

    const populated = await episode.populate({
      path: "season",
      model: Season,
      populate: {
        path: "movie",
        model: Movie,
        select: "slug",
      },
    });

    console.log(populated);

    const movieSlug = populated.season.movie.slug;

    req.session.success = `Episode ${episode.title} created successfully`;

    res.redirect(`/movies/${movieSlug}/`);
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const putEpisode = async (req, res, next) => {
  try {
    const episodeId = req.params.id;

    //edit
    const episode = await Episode.findByIdAndUpdate(episodeId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!episode) {
      throw new Error("Episode not found");
    }

    return res.json({ success: true, episode });
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const deleteEpisode = async (req, res, next) => {
  try {
    const episodeId = req.params.id;

    const episode = await Episode.findByIdAndDelete(episodeId);

    if (!episode) {
      throw new Error("Episode not found");
    }

    return res.json({ success: true, episode });
  } catch (err) {
    next(createError(404, err.message));
  }
};
