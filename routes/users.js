const express = require("express");
const bcrypt = require("bcrypt"); // just to compare the verification reset string in db
const sequelize = require("../database");
const Users = require("../models/users.model");

const verifyEmail = require("../models/verifyEmail.model");
const ResetPassword = require("../models/resetPassword.model");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const nodemailer = require("nodemailer");

require("dotenv").config();

var auth = require("../services/authentication");
var checkUserRole = require("../services/checkRole");

sequelize.sync().then(() => console.log("Dabase is ready to update users route"));

// Admin can get all GET all users
router.get("/users/adminDashboard", auth.authenticateToken, checkUserRole.checkUserRole, (req, res) => {
	console.log("the Propis", res.locals);

	Users.findAll({ attributes: ["name", "email", "home_address", "phone_no", "stack", "batch"] })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => console.log(err));
});

//GET all details about user for DASHBOARD USE
router.get("/users/userDashboard", auth.authenticateToken, (req, res) => {
	Users.findAll({ where: { email: res.locals.email }, attributes: ["name", "email", "home_address", "phone_no", "stack", "batch"] })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => console.log(err));
});

//forgot password
var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: `${process.env.mailTrap_user}`,
		pass: `${process.env.mailTrap_password}`,
	},
});
router.post("/forgotpassword", (req, res) => {
	const data = req.body;
	const redirectUrl = data.redirectUrl;
	Users.findOne({ where: { email: data.email } })
		.then((user) => {
			if (user) {
				if (user.verified) {
					sendResetEmail(user, redirectUrl, res);
				} else {
					let message = `Email hasn't been verified yet. Check your inbox`;
					res.render("error", { message });
				}
			} else {
				console.log("User does not exist");
				res.status(200).json({ message: "User is not registered, please sign up " });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(501).json({ message: err });
		});
});
const sendResetEmail = ({ user_id, email }, redirectUrl, res) => {
	const resetString = uuidv4() + user_id;

	//first clear existing password reset string in case user has sent in a request
	ResetPassword.destroy({ where: { user_id: user_id } })
		.then((result) => {
			//Reset record deleted successfully
			//Now we sent the reset string to email
			var mailOptions = {
				from: process.env.EMAIL,
				to: email,
				subject: "Password reset from AGBADEV",
				html: `<p><b> Use the link below to reset your password </b> </br> <b>Email: ${email}, pa} <a href=${
					redirectUrl + "/" + user_id + resetString
				}>click here </a> to proceed </b></b></p> `,
			};
			//hash the reset string
			const saltRounds = 10;
			bcrypt.hash(resetString, saltRounds)
				.then((hashedResetString) => {
					//set values in password reset collection
					ResetPassword.create({ user_id: user_id, hashedResetString: hashedResetString })
						.then((result) => {
							transport.sendMail(mailOptions, function (err, info) {
								if (err) {
									console.log(err);
								} else {
									console.log("Email sent: " + info.response);
								}
							});
							let message = `Password sent to your email`;
							res.render("error", { message });
						})
						.catch((err) => {
							console.log(err);
							res.json({ message: "Could not save record to database" });
						});
				})
				.catch((err) => {
					res.json({ status: "FAILED", message: "An error occured while hashing the password reset data" });
				});
		})
		.catch((err) => {
			//error while clearing existing record
			console.log(err);
			res.json({ status: "Failed", message: "clearing existing password" });
		});
};
router.put("/changePassword", (req, res) => {
	let { user_id, resetString, newPassword } = req.body;
	ResetPassword.findOne({ where: { user_id } })
		.then((user) => {
			if (user) {
				//if we find a user with the id
				//extract the stored hashed string and compare with bcrypt
				let hashedString = user.hashedResetString;
				bcrypt.compare(resetString, hashedString)
					.then((result) => {
						if (result) {
							//the hashed password matches the reset string so we proceed to change the password
							Users.findOne({ where: { user_id } })
								.then((user) => {
									if (user) {
										//got a user
										user.password = newPassword;
										user.save();
										res.json({ message: "password updated successfully" });
									}
								})
								.catch((err) => {
									console.log(err);
									res.json({ message: "cound not get user from database" });
								});
						} else {
							res.json({ message: "reset string did not match" });
						}
					})
					.catch((err) => {
						console.log(err);
						res.json({ message: "There was a problem hashing reset string in the database" });
					});
			} else {
				res.json({ message: "no password reset record found" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(401).json({ message: "could not search for user on database" });
		});
});

//update users
router.put("/users/:email", auth.authenticateToken, (req, res) => {
	let emailParam = req.params.email;
	console.log(emailParam);
	let mail = req.body.email;
	let name = req.body.name;
	Users.findOne({ where: { email: emailParam } })
		.then((user) => {
			if (user) {
				if (name) user.name = name;
				if (mail) user.email = mail;
				user.save();
				res.send("user updated");
			} else {
				throw "user with the email not found";
			}
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
});

//delete users
router.delete("/users/:email", auth.authenticateToken, (req, res) => {
	let emailParam = req.params.email;
	Users.destroy({ where: { email: emailParam } })
		.then((user) => {
			console.log(user);
			res.sendStatus(200);
		})
		.catch((err) => {
			res.json({ message: "item could not be deleted " });
		});
});

//Check TOKEN

router.get("/checkToken", auth.authenticateToken, (req, res) => {
	return res.status(200).json({ message: "true" });
});

router.post("/changePassword", auth.authenticateToken, (req, res) => {
	const userIncomming = req.body;
	const email = res.locals.email;
	console.log(email);

	Users.findOne({ where: { email: email, password: userIncomming.oldPassword } })
		.then((user) => {
			if (user) {
				user.password = userIncomming.newPassword;
				user.save();
				res.status(200).json({ message: "Password updated successfully" });
			} else {
				res.status(400).json({ message: "password incorrect" });
			}
		})
		.catch((err) => res.status(400).json({ message: "Something went wrong. Pleas tryp again later", err }));
});

//verify email route handler
router.get("/user/verify/:userId/:uniqueString", (req, res) => {
	let { userId, uniqueString } = req.params;

	verifyEmail
		.findOne({ where: { user_id: userId } })
		.then((item) => {
			console.log("the user ID is :", userId, "and the item found is ", item);
			if (item) {
				const { hashedUniqueString } = item;

				const { expiresAt } = item;
				if (expiresAt < Date.now()) {
					//record has expired
					verifyEmail
						.destroy({ where: { user_id: userId } })
						.then((result) => {
							let message = "Link has expired, sign up again";
							res.redirect(`/user/verified/error=true/message=${message}`);
						})
						.catch((err) => {
							let message = "An error occured while clearing expired password";
							res.redirect(`/user/verified/error=true/message=${message}`);
						});
				} else {
					//user verification code exist
					//uniqueString is coming from req.body while resetString the hashed string coming from database
					bcrypt.compare(uniqueString, hashedUniqueString)
						.then((result) => {
							//result is boolean
							if (result) {
								//string match therefore set the verified field in the user dab to true
								Users.findOne({ where: { user_id: userId } })
									.then((user) => {
										if (user) {
											user.verified = true;
											user.save();
											verifyEmail
												.destroy({ where: { user_id: userId } })
												.then((result) => {
													if (result) {
														return;
													} else {
														let message =
															"there was an error trying to clear user data";
														res.redirect(
															`/user/verified/error=true/message=${message}`
														);
													}
												})
												.catch((err) => {
													let message =
														"An error occured while clearing expired password";
													res.redirect(
														`/user/verified/error=true/message=${message}`
													);
												});
											res.render("verified");
										} else {
											throw "was unnable to update user record";
										}
									})
									.catch((err) => {
										console.log(err);
										res.send(err);
									});
							} else {
								//exiting record but incorrect verifcation details passed
								let message = "Invalie verification details passed. check your inbox";
								res.redirect(`/user/verified/error=true$message=${message}`);
							}
						})
						.catch((err) => {
							console.log(err);
							let message = "An error occureed while updating  user record to show verified";
							res.redirect(`/user/verified/error=true&message=${message}`);
						});
				}
			} else {
				let message = "Account record doen't exist or has been verified, signin or login";
				res.redirect(`/user/verified/error=true/message=${message}`);
			}
		})
		.catch((err) => {
			console.log(err);
			let message = "An error occureed while checking for existing user verification record";
			res.redirect(`/user/verified/error=true/message=${message}`);
		});
});
//verify page route
router.get("/user/verified/:error/:message", (req, res) => {
	//the resetPassword parameter is the ejs file to be rendered
	let message = req.params.message;
	res.render("error", { message });
});
module.exports = router;
