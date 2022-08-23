const { DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../database");

const resetPassword = sequelize.define("resetPassword", {
	user_id: {
		type: DataTypes.STRING,
	},
	hashedResetString: {
		type: DataTypes.STRING,
	},
	expiresAt: {
		type: DataTypes.FLOAT,
		defaultValue: Date.now() + 36000000,
	},
});

module.exports = resetPassword;
