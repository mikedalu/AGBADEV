const express = require("express");
const { urlencoded } = require("express");

const users = require("./routes/users");
const home = require("./routes/home");
const signup = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const app = express();

//EJS setup
const expressLayout = require("express-ejs-layouts");
//EJS
app.use(expressLayout);
app.set("view engine", "ejs");

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(users);
app.use(home);
app.use(signup);
app.use(login);
app.use(logout);

// const os = require("os");
// const time = () => {
// 	setTimeout(() => {
// 		console.log(os.uptime());
// 		for (let i = 0; i < 10000; i++) {
// 			console.log(i);
// 		}
// 		time();
// 	}, 1000);
// };
// time();

module.exports = app;
