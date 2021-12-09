import { getNewMovies, getMovieWithOneEpisode } from "./moviesService";
import User from "../auth/userModel";

export const getHomePage = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  // fetch movies
  const phimMoi = getNewMovies({ page, limit });

  // fetch phim hanh dong
  const phimHanhDong = getNewMovies({
    page,
    limit,
    categorySlugs: ["phim-hanh-dong"],
  });

  // fetch phim le
  const phimLe = getMovieWithOneEpisode(page, limit);

  // fetch phim hoat hinh
  const phimHoatHinh = getNewMovies({
    page,
    limit,
    categorySlugs: ["phim-hoat-hinh"],
  });

  // fetch phim kinh di
  const phimKinhDi = getNewMovies({
    page,
    limit,
    categorySlugs: ["phim-kinh-di"],
  });

  // find all user that user.isOnline equal true
  const onlineUsers = User.find({}).then((users) => {
    return users.filter((user) => user.isOnline());
  });

  // declare a promise.all
  const promises = [
    phimMoi,
    phimHanhDong,
    phimLe,
    phimHoatHinh,
    phimKinhDi,
    onlineUsers,
  ];

  // await all promises
  const [
    phimMoiData,
    phimHanhDongData,
    phimLeData,
    phimHoatHinhData,
    phimKinhDiData,
    onlineUsersData,
  ] = await Promise.all(promises);

  res.render("index", {
    title: "Trang chủ",
    data: {
      phimMoi: phimMoiData,
      phimHanhDong: phimHanhDongData,
      phimLe: phimLeData,
      phimHoatHinh: phimHoatHinhData,
      phimKinhDi: phimKinhDiData,
    },
    onlineUsers: onlineUsersData,
  });
};
