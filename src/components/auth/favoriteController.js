import User from "./userModel";
import Movie from "../movies/movieModel";
import createError from "http-errors";

export const getFavorites = async (req, res) => {
    //get user favorite movies
    const user = await User.findById(res.locals.user.id).populate("favorites");
  
    const favoriteMovies = user.favorites;
  
    res.render("auth/views/favorite", { title: "Favorite", favoriteMovies });
};

export const addFavorite = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
  
      const { slug } = req.body;
  
      const user = await User.findById(userId);
  
      // slug to objectId
      const movie = await Movie.findOne({ slug });
  
      // check if movie is already in favorites
      const isFavorite = user.favorites.some(
        (movieId) => movieId.toString() === movie._id.toString()
      );
  
      if (isFavorite) {
        throw createError(400, "Đã có trong danh sách yêu thích");
      }
  
      user.favorites.push(movie._id);
  
      await user.save();
  
      res.json({
        success: true,
        message: "Đã thêm vào yêu thích",
        favorites: user.favorites,
        slug,
      });
    } catch (err) {
      res.json({ 
        success: false, 
        message: err.message });
    }
};

export const removeFavorite = async (req, res, next) => {
    try {
      const { slug } = req.body;
  
      const user = await User.findById(res.locals.user.id);
  
      // slug to objectId
      const movie = await Movie.findOne({ slug });
  
      user.favorites.pull(movie._id);
  
      await user.save();
  
      res.json({
        success: true,
        message: "Đã xoá khỏi yêu thích",
        favorites: user.favorites,
        slug,
      });
    } catch (err) {
      res.json({ 
        success: false, 
        message: "Đã có trong danh sách yêu thích" });
    }
};