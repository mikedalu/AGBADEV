const sequelize = require("../database");
const { Sequelize, DataTypes } = require("sequelize");

const users = sequelize.define("users", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	phone_no: {
		type: DataTypes.CHAR(15),
		allowNull: true,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	batch: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	country: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	home_address: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	stack: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userType: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = users;
