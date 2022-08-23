const { DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../database");

const verifyEmail = sequelize.define("verifyEmail", {
	user_id: {
		type: DataTypes.STRING,
	},
	hashedUniqueString: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	expiresAt: {
		type: DataTypes.FLOAT,
		defaultValue: Date.now() + 6000000,
	},
});

module.exports = verifyEmail;
