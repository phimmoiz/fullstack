import User from "./user.model";
import { default as jwt } from "jsonwebtoken";

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // get user password
    const user = await User.findOne({
      email,
    });

    const isPasswordValid = await user.checkPassword(password);

    console.log(user, isPasswordValid);

    if (!user || !isPasswordValid) {
      throw new Error("Tên đăng nhập / email hoặc mật khẩu không đúng");
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

    res.redirect("/");
  } catch (err) {
    res.render("auth/views/login", {
      title: "Đăng nhập",
      error: err.message,
    });
  }
};

export const getLogin = (_, res) => {
  res.render("auth/views/login", { title: "Đăng nhập" });
};
