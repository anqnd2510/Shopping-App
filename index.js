const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// moment dung de validate time
const moment = require("moment");
// Dung de sai env
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

//Pug
app.set("views", "./views");
app.set("view engine", "pug");

//Flash
app.use(cookieParser("ASFASFACA"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce")));
  // End TinyMCE


// su dung App Locals Variable, tao bien toan cuc cho du an
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Dung de sai duoc public
app.use(express.static("public"));

// Routes
routeClient(app);
routeAdmin(app);

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  })
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
