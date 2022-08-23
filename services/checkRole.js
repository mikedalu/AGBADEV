require("dotenv").config();

function checkUserRole(req, res, next) {
	if (res.locals.userType == process.env.student_USER) {
		next();
	} else {
		return res.sendStatus(401);
	}
}

module.exports = { checkUserRole };
