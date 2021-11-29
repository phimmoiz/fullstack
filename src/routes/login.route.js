import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import csrf from "csurf";

var csrfProtection = csrf({ cookie: true });

const router = Router();

router.get("/", csrfProtection, (req, res) => {
  res.render("login", { title: "Đăng nhập", csrfToken: req.csrfToken() });
});

router.post("/", csrfProtection, async (req, res) => {
  try {
    const { email, password } = req.body;

    // get user password
    const user = await User.findOne({ email, password });

    if (!user) {
      throw new Error("User not found");
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // res.json({ success: true, user });

    res.redirect("/");
  } catch (err) {
    // res 403
    console.log(err);
    // res.status(403).json({ success: false, message: err.message });

    res.render("login", {
      title: "Đăng nhập",
      error: err.message,
    });
  }
});
export default router;
