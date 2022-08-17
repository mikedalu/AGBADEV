const sequelize = require("../database");
const { Sequelize, DataTypes } = require("sequelize");

const users = sequelize.define("users", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		unique: true,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	phone_no: {
		type: DataTypes.CHAR(15),
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	batch: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: "A",
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
		defaultValue: "subscriber",
	},
});

module.exports = users;
