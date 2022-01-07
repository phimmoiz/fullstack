import Category from "./categoryModel";
import createError from "http-errors";
import Movie from "./movieModel";
export const addCategory = async (req, res) => {
  try {
    const { title, description, slug } = req.body;

    // create category
    const newCat = await Category.create({
      title,
      description,
      slug,
    });

    res.json({ success: true, data: newCat, message: "Thêm chuyên mục thành công !" });

  } catch (err) {
    res.json({ success: false, message: "Thêm chuyên mục thất bại !" });
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("movies");

    res.render("movies/views/categories/index", {
      title: "Danh sách chuyên mục",
      categories,
    });
  } catch (err) {
    next(createError(403, err));
  }
};

export const pagingCategories = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const cat = await Category.findOne({ slug });

    const populated = await cat.populate({
      path: "movies",
      model: Movie,
      options: {
        sort: { createdAt: -1 },
        limit,
        skip: (page - 1) * limit,
      },
    });

    const totalMovies = await cat.__v;

    // if not found
    if (!cat) {
      throw new Error("Category not found");
    }

    // get total pages
    const totalPages = Math.ceil(totalMovies / 10);

    const pagination = Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (page) => {
        return {
          url: `/categories/${cat.slug}?page=${page}`,
          number: page,
        };
      }
    );

    res.render("movies/views/categories/singleCategory", {
      title: cat.title,
      category: populated,
      pagination,
      currentIndex: page - 1,
    });
  } catch (err) {
    // 404
    next(createError(404, err));
  }
};
// export function addCategory(req, res) {
//   const category = new Category(req.body);

//   category.save((err, category) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json(category);
//   });
// }

// export function deleteCategory(req, res) {
//   Category.findByIdAndRemove(req.params.id, (err, category) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json({ message: "Category successfully deleted" });
//   });
// }

// export function getCategories(req, res) {
//   Category.find((err, categories) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json(categories);
//   });
// }

// export function editCategory(req, res) {
//   Category.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true },
//     (err, category) => {
//       if (err) {
//         res.send(err);
//       }
//       res.json(category);
//     }
//   );
// }
