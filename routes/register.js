const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/users.model");

const verifyEmail = require("../models/verifyEmail.model");

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: `${process.env.mailTrap_user}`,
		pass: `${process.env.mailTrap_password}`,
	},
});
router.post("/signup", async (req, res) => {
	let user = req.body;
	let cryptPass = await bcrypt.hash(user.password, 10);

	let { firstName, lastName, email, phone_no, batch, country, home_address, stack, sex, userType } = await user;
	if (firstName == "" || lastName == "" || email == "" || country == "" || home_address == "" || sex == "" || stack == "")
		return res.json({ status: "FAILED", message: "Empty fields!" });
	//send verifcation email
	Users.create({ firstName, lastName, email, phone_no, stack, password: cryptPass, batch, country, home_address, sex, userType })
		.then((result) => {
			const sendVerificationEmail = ({ user_id, email }, res) => {
				//url to be used in the email
				const currentUrl = "http://localhost:4000/";
				const uniqueString = uuidv4() + user_id;
				var mailOptions = {
					from: process.env.EMAIL,
					to: email,
					subject: "Verify your email for AGBADEV",
					html: `<p>verify your email address to complete the signup and login into your account </p>
							<p>This  link <b>expires in 1 hour </b></p>
							 <p>click <a href=${currentUrl + "user/verify/" + user_id + "/" + uniqueString}>here<a></p>		
					`,
				};
				//hash the uniqueString
				// const saltRounds = 10;
				bcrypt.hash(uniqueString, 10)
					.then((hashedUniqueString) => {
						verifyEmail.create({ user_id: user_id, hashedUniqueString: hashedUniqueString });

						transport.verify((err, result) => {
							if (err) {
								console.log(err);
							} else {
								console.log(" Transporter Ready to send message");
							}
						});
						transport.sendMail(mailOptions, function (err, info) {
							if (err) {
								console.log(err);
							} else {
								console.log("Verification email sent: " + info.response);
								res.json({ status: "Pending", message: "verification email sent" });
							}
						});
					})
					.catch((err) => res.json({ status: "failed", message: "An error occured while hashing email" }));
			};

			sendVerificationEmail(result, res);
			res.status(200).json({ message: "User registered successfully" });
		})
		.catch((err) => {
			res.status(403).json({
				error: err,
				// message2: err.original,
			});
		});
});

module.exports = router;
