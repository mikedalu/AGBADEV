require("dotenv");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; //if authHeader is not null or not false then split at space and get the second item which is the token
	if (token == null) {
		return res.sendStatus(401);
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, result) => {
		if (err) {
			console.log(err);
			return res.sendStatus(403);
		} else {
			// console.log(response);
			res.locals = result;
			next();
		}
	});
}
module.exports = { authenticateToken };
