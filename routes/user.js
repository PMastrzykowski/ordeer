const express = require("express");
const passport = require("passport");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const upload = require("../middleware/upload");

//Auth

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.post("/refresh_token", userCtrl.refresh_token);

router.post("/forgotpassword", userCtrl.forgotpassword);

router.post("/activate", userCtrl.activate);

router.post("/isresetvalid", userCtrl.isresetvalid);

router.post("/reset", userCtrl.reset);

//Administration

router.post("/changepassword", auth, userCtrl.changepassword);

router.post("/changeemailrequest", auth, userCtrl.changeemailrequest);

router.post("/changeemail", auth, userCtrl.changeemail);

router.post("/changename", auth, userCtrl.changename);

router.post("/deleteaccount", auth, userCtrl.deleteaccount);

router.post("/upload", auth, upload.single("layoutImage"), userCtrl.upload);

router.get("/getuser", auth, userCtrl.getUser);

module.exports = router;
