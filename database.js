const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
	dialect: "mysql",
	host: `${process.env.DB_HOST}`,
});

// sequelize
// 	.authenticate()
// 	.then(() => {
// 		console.log("connection estabilished successfully");
// 	})
// 	.catch((err) => console.log("unbable to connect to the databases  ", err));
module.exports = sequelize;
