import { getNewMovies, getMovieWithOneEpisode } from "./moviesService";

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

  // declare a promise.all
  const promises = [phimMoi, phimHanhDong, phimLe, phimHoatHinh, phimKinhDi];

  // await all promises
  const [
    phimMoiData,
    phimHanhDongData,
    phimLeData,
    phimHoatHinhData,
    phimKinhDiData,
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
  });
};