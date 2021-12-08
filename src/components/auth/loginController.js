import User from "./userModel";
import { default as jwt } from "jsonwebtoken";

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user with email or username
    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }
    // if user is banned
    if (user.banned) {
      throw new Error("Tài khoản đã bị khóa");
    }
    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      throw new Error("Mật khẩu không đúng");
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
      process.env.JWT_SECRET,
      {
        //1 month
        expiresIn: "24h",
      }
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

export const getLogin = (req, res) => {
  const success = req.session?.success;

  res.render("auth/views/login", { title: "Đăng nhập", success });
};
