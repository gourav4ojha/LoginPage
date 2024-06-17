const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Reset password",
    text: `click to change your password ${link}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
});

module.exports = {sendEmail};


 //email otp validation
  // const sendEmail = async() =>{
  //   let dataSend = {
  //     email: inputUser.email,
  //   };
  //   try {
  //     const res = await axios.post('http://localhost:4040/email/sendEmail', dataSend) 
  //      console.log(res);      
  //      if (res.status >= 200 && res.status < 300) {
  //       alert("Send Successfully !");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to send OTP. Please try again.");

  //   }
  // }




//email otp validation 
// dotenv.config();
// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// const sendEmail = expressAsyncHandler(async (req, res) => {
//   const { email } = req.body;
//   var mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject: "OTP form login page",
//     text: `Your OTP is: ${OTP}`,
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent successfully!");
//     }
//   });
// });

app.post("/email/sendEmail", sendEmail);
app.get("/", (req, res) => {
  res.send("Hello World!");
});