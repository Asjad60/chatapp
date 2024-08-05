import nodemailer from "nodemailer";

const mailSender = (email, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    const info = transporter.sendMail({
      from: ` "CHIT CHAT" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${subject}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log("Sending Mail Error => ", error);
    return error.message;
  }
};

export default mailSender;
