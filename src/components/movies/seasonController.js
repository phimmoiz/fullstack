import Season from "./seasonModel";
import Episode from "./episodeModel";
import Movie from "./movieModel";

export const getSeason = async (req, res, next) => {
    try {
      const { slug, name } = req.params;
  
      const movie = await Movie.findOne({ slug }).populate({
        path: "seasons",
        model: Season,
      });
  
      if (!movie) {
        throw new Error("Movie not found");
      }
  
      const season = movie.seasons.find((s) => s.name === name);
  
      // const season = await Season.findOne({ slug, name }).populate({
      //   path: "episodes",
      //   model: Episode,
      // });
  
      if (!season) throw new Error("Season not found");
  
      res.status(200).json(season);
    } catch (error) {
      next(createError(404, error.message));
    }
};

export const postSeason = async (req, res, next) => {
    try {
      const { name, movie } = req.body;
  
      const season = new Season({ name, movie });
  
      await season.save();
  
      const { slug } = await Movie.findOne({ _id: movie });
  
      // res.status(201).json({ success: true, season });
  
      res.redirect(`/admin/movies/${slug}/edit`);
    } catch (err) {
      next(err);
    }
};

export const deleteSeason = async (req, res, next) => {
    try {
      const { slug, seasonSlug } = req.params;
  
      const movie = await Movie.findOne({ slug }).populate({
        path: "seasons",
        model: Season,
      });
  
      const season = movie.seasons.find((s) => s.slug === seasonSlug);
  
      if (!season) throw new Error("Season not found");
  
      await season.remove();
  
      if (!season) {
        throw new Error("Season not found");
      }
  
      res.status(200).json({ success: true, season });
    } catch (err) {
      next(err);
    }
};

export const putSeason = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { name } = req.body;
  
      const season = await Season.findOneAndUpdate(
        { slug },
        { name },
        { new: true }
      );
  
      if (!season) {
        throw new Error("Season not found");
      }
  
      res.status(200).json(season);
    } catch (err) {
      next(err);
    }
};