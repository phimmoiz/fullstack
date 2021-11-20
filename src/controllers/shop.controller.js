import jwt from "jsonwebtoken";

export const getGioHang = async (req, res) => {
  // check if user token is valid
  try {
    const token = req.cookies.token;

    if (!token) throw new Error("User not logged in");

    const user = await jwt.verify(token, process.env.JWT_SECRET);

    // res.render("shop/cart", { title: "Cart", user });

    res.json(user);
  } catch (err) {
    console.log(err);
    // add tindeptrai header
    res.redirect("/login");
  }
};
