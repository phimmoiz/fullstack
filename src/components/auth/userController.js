import User from "./userModel";
import sgMail from "../../services/sendGrid";
import Randomstring from "randomstring";
import { hashPassword } from "../../utils";

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

export const postResetPwd = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  user.resetPasswordToken = Randomstring.generate();
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();
  const msg = {
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Khôi phục mật khẩu tài khoản PhimMoi",
    text: `Xin chào ${user.fullname},\n\n`,
    html: `<h1>Xin chào ${user.fullname}</h1>
    <p>Bạn đã yêu cầu khôi phục mật khẩu tài khoản tại PhimMoi</p>
    <p>Vui lòng click vào link bên dưới để khôi phục mật khẩu</p>
    <a href="${process.env.DOMAIN_NAME}/user/reset-pwd?email=${user.email}&token=${user.resetPasswordToken}">Khôi phục mật khẩu</a>
    <p>Nếu bạn không phải là người yêu cầu khôi phục mật khẩu này, vui lòng bỏ qua email này.</p>
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

export const getResetPwd = async (req, res) => {
  const { email, token } = req.query;

  const user = await User.findOne({ email });

  if (user) {
    if (user.resetPasswordToken == token) {
      if (user.resetPasswordExpires > Date.now()) {
        res.render("auth/views/reset-pwd", {
          title: `Khôi phục mật khẩu | ${email}`,
          success: true,
          message: "Nhập mật khẩu mới của bạn vào form bên dưới để đặt lại mật khẩu",
          email: user.email,
        });
        return;
      }
      res.render("auth/views/reset-pwd", {
        title: `Khôi phục mật khẩu | ${email}`,
        success: false,
        error: "Token quá hạn, vui lòng yêu cầu lại",
        message: "Khôi phục mật khẩu thất bại",
      });
      return;
    }

    const error = "Token không hợp lệ";
    if (!user) {
      error = "Tài khoản không tồn tại";
    }

    res.render("auth/views/reset-pwd", {
      title: `Khôi phục mật khẩu | ${email}`,
      success: false,
      error: error,
      message: "Khôi phục mật khẩu thất bại",
    });
  };
};

export const postUpdatePassword = async (req, res) => {
  // console.log("req.body", req.body);
  const { email, newpwd } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.password = await hashPassword(newpwd);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
    return;
  }
  res.json({
    success: false,
    message: "Đổi mật khẩu thất bại",
  });

};


