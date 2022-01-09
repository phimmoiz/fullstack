import { hashPassword } from "../../utils";
import User from "./userModel";
import sgMail from "../../services/sendGrid";

export const getRegister = (req, res) => {
  res.render("auth/views/register", { title: "Đăng ký" });
};

export const postRegister = async (req, res) => {
  try {
    const { username, password, repassword, email, fullname } = req.body;
    // destructuring
    // const username = req.body.username;
    // const password = req.body.password;
    // const repassword = req.body.repassword;

    // check if one missing, show error
    if (!username || !password || !repassword || !email || !fullname) {
      throw new Error("Vui lòng điền đầy đủ thông tin.");
    }

    // check if password and repassword are not the same
    if (password !== repassword) {
      throw new Error("Mật khẩu không trùng khớp");
    }

    // check if password is less than 6 characters
    if (password.length < 6) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // check if username is less than 6 characters
    if (username.length < 6) {
      throw new Error("Tên đăng nhập phải có ít nhất 6 ký tự");
    }

    // check if email is valid
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      throw new Error("Email không hợp lệ");
    }

    // mongoose add user to database
    const user = await User.create({
      username,
      password: await hashPassword(password),
      email,
      fullname,
    });

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Xác thực tài khoản PhimMoi",
      text: `Xin chào ${fullname}`,
      html: `<h1>Xin chào ${fullname}</h1>
      <p>Bạn vừa đăng ký tài khoản tại PhimMoi.vn</p>
      <p>Vui lòng click vào link sau để xác thực tài khoản:</p>
      <a href="${process.env.DOMAIN_NAME}/user/activate?email=${email}&token=${user.activationToken}">Xác thực tài khoản</a>
      <p>Nếu bạn không phải là người đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
      <p>PhimMoi</p>
    `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((err) => {
        console.log("send email", err);
      });

    req.flash("success", "Đăng ký thành công");
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    return res.render("auth/views/register", {
      title: "Đăng ký",
      error: err,
    });
  }
};
