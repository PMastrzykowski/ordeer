require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./db");
const user = require("./routes/user");
const cors = require("cors");

const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const short = require("shortid");

short.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

mongoose
    .connect(config.DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("DB Connected!"))
    .catch((err) => {
        console.log("Can not connect to the database" + err);
    });

const app = express();
app.use(passport.initialize());
require("./passport")(passport);
app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://qrspots.herokuapp.com",
            "https://qrspots.herokuapp.com",
            "http://optimistic-hopper-eed294.netlify.app",
            "https://optimistic-hopper-eed294.netlify.app",
            "https://a696-188-26-215-18.ngrok.io",
            "http://a696-188-26-215-18.ngrok.io"
        ],
    })
);

// Enable sessions using encrypted cookies
app.use(cookieParser())
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//     session({
//         cookie: { maxAge: 60000 },
//         secret: process.env.COOKIE_SECRET,
//         signed: true,
//         resave: true,
//     })
// );

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api/users", user);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    app.use("*", express.static("frontend/build"));
}

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

//Static files
app.use(express.static("public"));