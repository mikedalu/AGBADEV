const express = require("express");
const { urlencoded } = require("express");

const users = require("./routes/users");
const home = require("./routes/home");
const signup = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const app = express();

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
// 		time();
// 	}, 1000);
// };
// time();

module.exports = app;
