import express from "express";
import userRoute from "./user.route";
import signUpRoute from "./signup.route";
import signInRoute from "./signin.route";
import filmListRoute from "./filmList.route";
import filmRoute from "./film.route";
import topViewRoute from "./topView.route";
import shopRoute from "./shop.route";
import adminRoute from "./admin.route";
import logOutRoute from "./logout.route";
import categoryRoute from "./category.route";
import movieRoute from "./movie.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/signin",
    route: signInRoute,
  },
  {
    path: "/signup",
    route: signUpRoute,
  },
  {
    path: "/logout",
    route: logOutRoute,
  },
  {
    path: "/danh-sach",
    route: filmListRoute,
  },
  {
    path: "/phim",
    route: filmRoute,
  },
  {
    path: "/top-luot-xem",
    route: topViewRoute,
  },
  {
    path: "/shop",
    route: shopRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/movie",
    route: movieRoute,
  },
];

// set router for defaultRoutes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route("/").get((req, res) => {
  res.render("index", { title: "Trang chủ" });
});

export default router;
