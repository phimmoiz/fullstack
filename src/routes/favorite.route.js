import { Router } from "express";
import User from "../models/user.model";
import Movie from "../models/movie.model";
import createError from "http-errors";

const router = Router();

router.get("/", async (req, res) => {
  console.log(res.locals);
  //get user favorite movies
  const user = await User.findById(res.locals.user.id).populate("favorites");
  
  const favoriteMovies = user.favorites;
  
  res.render("favorite", { title: "Favorite", favoriteMovies });
});

router.post('/', async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    
    const { slug } = req.body;

    const user = await User.findById(userId);

    // slug to objectId
    const movie = await Movie.findOne({ slug });

    user.favorites.push(movie._id);

    await user.save();
    
    res.json({ success: true, message: "Movie added to favorites", favorites: user.favorites });
  }
  catch (err) {
    next(createError(500, err));
  }

});

router.delete('/', async (req, res, next) => {
  try {
    const { slug } = req.body;

    const user = await User.findById(res.locals.user.id);

    // slug to objectId
    const movie = await Movie.findOne({ slug });

    user.favorites.pull(movie._id);

    await user.save();

    res.json({ success: true, message: "Movie removed from favorites", favorites: user.favorites });
  }
  catch (err) {
    next(createError(500, err));
  }
})
export default router;