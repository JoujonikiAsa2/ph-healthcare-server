import nodemailer from "nodemailer";
import config from "../../config";

const sendEmail = async (email: string, html:string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_password,
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"PH Health Care 👻" <joujonikiasaroy@gmail.com>', // sender address
    to: email,
    subject: "Reset Password Link",
    html, 
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
