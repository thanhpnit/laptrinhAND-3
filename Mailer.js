
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'thanhpnvpbq@gmail.com', // Cần thay bằng email của bạn
      pass: 'gdiq yhbz iivk uist' // Cần thay bằng mật khẩu ứng dụng (App Password)
    }
});

module.exports = { transporter };