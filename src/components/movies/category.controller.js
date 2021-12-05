import Category from "./category.model";

export function addCategory(req, res) {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      res.send(err);
    }
    res.json(category);
  });
}

export function deleteCategory(req, res) {
  Category.findByIdAndRemove(req.params.id, (err, category) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Category successfully deleted" });
  });
}

export function getCategories(req, res) {
  Category.find((err, categories) => {
    if (err) {
      res.send(err);
    }
    res.json(categories);
  });
}

export function editCategory(req, res) {
  Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, category) => {
      if (err) {
        res.send(err);
      }
      res.json(category);
    }
  );
}
