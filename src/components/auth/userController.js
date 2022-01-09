import { create } from "hbs";
import User from "./userModel";
import sgMail from "../../services/sendGrid";

export const getUser = async (req, res) => {
  const { name } = req.query;

  const user = await User.findOne({ username: name });

  if (user) {
    res.json({
      user: user.username,
      email: user.email,
      id: user._id,
    });
    return;
  }

  res.json({
    success: false,
    message: "User not found",
  });
};

export const getActivate = async (req, res) => {
  const { email, token } = req.query;

  const user = await User.findOne({ email });

  if (user) {
    if (user.activationToken == token) {
      user.isActivated = true;
      user.activationToken = undefined;
      await user.save();

      res.render("auth/views/activate", {
        title: `Kích hoạt tài khoản | ${email}`,
        success: true,
        message: "Xác thực tài khoản thành công",
      });
      return;
    }
    if (user.isActivated) {
      res.render("auth/views/activate", {
        title: `Kích hoạt tài khoản | ${email}`,
        success: true,
        message: "Tài khoản đã được kích hoạt",
      });
      return;
    }
  }

  const error = "token không hợp lệ";
  if (!user) {
    error = "Tài khoản không tồn tại";
  }


  res.render("auth/views/activate", {
    title: `Kích hoạt tài khoản | ${email}`,
    success: false,
    error: error,
    message: "Xác thực tài khoản thất bại",
  });

};

export const postActivate = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Xác thực tài khoản PhimMoi",
    text: `Xin chào ${user.fullname},\n\n`,
    html: `<h1>Xin chào ${user.fullname}</h1>
    <p>Bạn đã đăng ký tài khoản thành công tại PhimMoi</p>
    <p>Vui lòng click vào link bên dưới để kích hoạt tài khoản</p>
    <a href="${process.env.DOMAIN_NAME}/user/activate?email=${user.email}&token=${user.activationToken}">Xác thực tài khoản</a>
    <p>Nếu bạn không phải là người đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    <p>PhimMoi</p>
  `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.json({
        success: true,
        message: "Email sent",
      });
    })
    .catch((err) => {
      console.log("send email", err);
      res.json({
        success: false,
        message: "Email not sent",
      });
    });

};