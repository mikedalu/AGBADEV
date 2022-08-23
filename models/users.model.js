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
	user_id: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		unique: true,
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	sex: {
		type: DataTypes.CHAR(1),
		allowNull: false,
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
		defaultValue: "student",
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

module.exports = users;
