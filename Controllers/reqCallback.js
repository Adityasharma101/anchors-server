const nodemailer = require("nodemailer");

const reqCallback = async (req, res) => {
  const { name, contactNumber, callbackTime, comments } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jordan.kulas@ethereal.email",
      pass: "BB8jxYjHmYJsjbAnS5",
    },
  });

  const mailOptions = {
    from: "jordan.kulas@ethereal.email",
    to: "ravi@anchors.in", // Recipient's email address
    subject: "Callback Request",
    text: `
      Name: ${name || "Not provided"}
      Contact Number: ${contactNumber}
      Preferred Callback Time: ${callbackTime || "Not specified"}
      Additional Comments/Questions: ${comments || "None"}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Callback request sent successfully" });
    }
  });

};

module.exports = reqCallback;
