// const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const bodyParser = require('body-parser');
const twilio = require('twilio');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); 
const cors = require("cors");
const app = express();
const PORT = 4040;
const saltRounds = 10;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });

// Create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
});

// Create User model
const User = mongoose.model("User", userSchema);

// User signup route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
    if (existingUser) {
      return res.status(400).send("User with this email or phone already exists");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, phone, password: hashedPassword });
    const userData = await user.save();
    res.status(201).send(userData);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


// User login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3000s' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Profile 
app.get('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.send({ result: "invalid token" });
    } else {
      const userId = authData.userId;
      User.findById(userId).exec()
        .then(user => {
          if (!user) {
            return res.status(404).send('User not found');
          }
          res.send(user);
        })
        .catch(err => {
          res.status(500).send(err.message);
        });
    }
  });
});

//Forgot Password
app.post('/forgot-password' , async(req,res) =>{
  const email = req.body.email ;
   try{
     const olduser = await User.findOne({email : email})
     if(!olduser){
       return res.json({status : "Email does not exist"})
     }
     const key = process.env.JWT_SECRET + olduser.password;
     const token = jwt.sign({ email: olduser.email,id: olduser._id }, key , { expiresIn: '3000s' });
     const link =`http://localhost:3000/reset-password/${olduser._id}/${token}`;
     await sendEmail(email, link);
     res.send(link)
   }catch(e){
      res.status(422).send(e.message)
   }
})

//email otp validation 
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

const sendEmail = async (email, link) => {
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Reset password",
    text: `Click to change your password ${link}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

app.post("/email/sendEmail", async (req, res) => {
  const { email, link } = req.body;
  await sendEmail(email, link);
  res.send("Email sent successfully!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Reset Password 
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const saltRounds = 10; // Specify the number of salt rounds
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.status(201).send({ status: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Invalid or expired token" });
  }
});

// Token verification 
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
  } else {
      res.status(403).send({
          result: "Token is not valid"
      });
  }
}

// SMS top verification
// dotenv.config();
const client = twilio(process.env.SMS_SID, process.env.SMS_TOKEN);

app.post('/sendotp', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  client.messages
    .create({
      from: process.env.SMS_NUMBER,
      body: `Your OTP is: ${otp}`,
      to: `+91${phoneNumber}`,
    })
    .then(() => {
      res.send({ success: true, otp });
    })
    .catch((error) => {
      console.error('Error sending OTP:', error);
      res.status(500).send({ success: false, error: error.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
