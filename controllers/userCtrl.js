const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const templates = require("../emails/templates");
const sendEmail = require("../emails/sendEmail");
var Datauri = require("datauri");
const short = require("shortid");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MULTER

const TemporaryUser = require("../models/TemporaryUser");
const TemporaryPassword = require("../models/TemporaryPassword");
const TemporaryCode = require("../models/TemporaryCode");
const User = require("../models/User");

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10s",
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};

const userCtrl = {
    register: (req, res) => {
        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        User.findOne({
            email: req.body.email,
        }).then((user) => {
            if (user) {
                return res.status(400).json({
                    email: "The account with this email already exists. Try to log in!",
                });
            } else {
                TemporaryUser.findOne({
                    email: req.body.email,
                }).then((user) => {
                    const newTempUser = () => {
                        const newUser = new TemporaryUser({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                            _id: short.generate(),
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) {
                                console.error("There was an error", err);
                                return res.status(400).json({
                                    backend:
                                        "The error occured while encrypting the password",
                                });
                            } else {
                                bcrypt.hash(
                                    newUser.password,
                                    salt,
                                    (err, hash) => {
                                        if (err) {
                                            console.error(
                                                "There was an error",
                                                err
                                            );
                                            return res.status(400).json({
                                                backend:
                                                    "The error occured while encrypting the password",
                                            });
                                        } else {
                                            newUser.password = hash;
                                            newUser.save().then((user) => {
                                                const activation_token =
                                                    createActivationToken({
                                                        name: user.name,
                                                        _id: user._id,
                                                    });
                                                sendEmail(
                                                    user.email,
                                                    "Activation",
                                                    templates.activateTemplate({
                                                        name: user.name,
                                                        activation_token,
                                                    }),
                                                    (err, data) => {
                                                        if (err) {
                                                            TemporaryUser.deleteOne(
                                                                {
                                                                    email: user.email,
                                                                }
                                                            ).then(() => {
                                                                return res
                                                                    .status(400)
                                                                    .json({
                                                                        email: "The activation email could not be delivered",
                                                                    });
                                                            });
                                                        } else {
                                                            console.log(
                                                                "Email sent!"
                                                            );
                                                            return res.json(
                                                                "Activation email sent."
                                                            );
                                                        }
                                                    }
                                                );
                                            });
                                        }
                                    }
                                );
                            }
                        });
                    };
                    if (user) {
                        TemporaryUser.deleteOne({
                            email: req.body.email,
                        }).then(() => {
                            newTempUser();
                        });
                    } else {
                        newTempUser();
                    }
                });
            }
        });
    },
    login: async (req, res) => {
        try {
            const { errors, isValid } = validateLoginInput(req.body);

            if (!isValid) {
                return res.status(400).json(errors);
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                const temporaryUser = await TemporaryUser.findOne({
                    email: req.body.email,
                });
                if (temporaryUser) {
                    return res.status(400).json({
                        email: "Email is waiting for activation.",
                    });
                } else {
                    errors.email = "Email or password is incorrect";
                    errors.password = "Email or password is incorrect";
                    return res.status(404).json(errors);
                }
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                errors.email = "Email or password is incorrect.";
                errors.password = "Email or password is incorrect.";
                return res.status(400).json(errors);
            }
            const refresh_token = createRefreshToken({ id: user.id });
            const access_token = createAccessToken({ id: user.id });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/api/users/refresh_token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.json({ success: true, msg: "Login success!", access_token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: (req, res) => {
        try {
            res.clearCookie("refreshtoken", {
                path: "/api/users/refresh_token",
            });
            return res.json({ msg: "Logged out." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    refresh_token: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) {
                return res.status(400).json({ msg: "Cookie does not exist." });
            }

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                (err, user) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ msg: "Expired refresh token" });
                    }
                    const access_token = createAccessToken({ id: user.id });
                    res.json({ access_token });
                }
            );
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    forgotpassword: async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email,
            });
            if (user) {
                const temporaryUser = await TemporaryPassword.findOne({
                    email: req.body.email,
                });
                const temporary = async (prevUser) => {
                    const newPassword = new TemporaryPassword({
                        email: prevUser.email,
                        _id: short.generate(),
                    });
                    const updatedUser = await newPassword.save();
                    const activation_token = createActivationToken({
                        name: user.name,
                        id: updatedUser._id,
                    });
                    sendEmail(
                        updatedUser.email,
                        "Reset password",
                        templates.forgotTemplate({
                            name: user.name,
                            activation_token,
                        }),
                        (err, data) => {
                            if (err) {
                                return res.status(400).json({
                                    email: "Reset password mail cannot be delivered.",
                                });
                            }
                            console.log("Reset email sent!");
                            return res.json("Reset password email sent.");
                        }
                    );
                };
                if (temporaryUser) {
                    await TemporaryPassword.deleteOne({
                        email: req.body.email,
                    });
                }
                temporary(req.body);
            } else {
                return res.status(400).json({
                    email: "This email was not recognized.",
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    activate: async (req, res) => {
        const user = jwt.verify(
            req.body.id,
            process.env.ACTIVATION_TOKEN_SECRET
        );
        const { _id } = user;
        try {
            const tempUser = await TemporaryUser.findOne({
                _id: _id,
            });
            if (tempUser) {
                let user = await User.findOne({
                    email: tempUser.email,
                });
                if (user) {
                    return res.status(400).json({
                        activation:
                            "Account with this email is already active.",
                    });
                } else {
                    const newUser = new User({
                        name: tempUser.name,
                        email: tempUser.email,
                        password: tempUser.password,
                        date: tempUser.date,
                        language: "en",
                    });
                    user = await newUser.save();
                    await TemporaryUser.deleteOne({
                        _id: _id,
                    });
                    return res.status(200).json({
                        success: true,
                        activation: "Account activated successfully, Log in!",
                    });
                }
            } else {
                return res.status(404).json({
                    activation: "The activation link is invalid.",
                });
            }
        } catch (err) {
            return res
                .status(404)
                .json({ activation: "The activation link is invalid." });
        }
    },
    isresetvalid: async (req, res) => {
        try {
            const user = jwt.verify(
                req.body.id,
                process.env.ACTIVATION_TOKEN_SECRET
            );
            const { id } = user;
            const tempUser = await TemporaryPassword.findOne({
                _id: id,
            });
            if (!tempUser) {
                return res.status(404).json("Invalid reset attempt");
            }
            return res.json("Valid reset attempt");
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    reset: async (req, res) => {
        const verificationData = jwt.verify(
            req.body.id,
            process.env.ACTIVATION_TOKEN_SECRET
        );
        const { id } = verificationData;
        try {
            const tempUser = await TemporaryPassword.findOne({
                _id: id,
            });
            if (!tempUser) {
                return res
                    .status(404)
                    .json({ reset: "The password reset link is invalid." });
            }
            const user = await User.findOne({
                email: tempUser.email,
            });
            if (!user) {
                return res.status(404).json({ reset: "User does not exist." });
            }
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) {
                    return res.status(404).json({
                        reset: "The password couldn't be changed.",
                    });
                } else {
                    bcrypt.hash(req.body.password, salt, async (err, hash) => {
                        if (err) {
                            return res.status(404).json({
                                reset: "The password couldn't be changed.",
                            });
                        } else {
                            await User.findOneAndUpdate(
                                {
                                    email: tempUser.email,
                                },
                                {
                                    password: hash,
                                },
                                {
                                    new: true,
                                }
                            );
                            await TemporaryPassword.deleteOne({
                                _id: id,
                            });
                            return res.json("Password changed.");
                        }
                    });
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    changepassword: async (req, res) => {
        const id = req.user.id;
        const { newPassword, currentPassword } = req.body;
        try {
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({
                    msg: "Password couldn't be changed.",
                });
            }
            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isMatch) {
                return res.status(404).json({
                    passwordCurrent: "Current password is incorrect.",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            await User.updateOne(
                { _id: id },
                {
                    password: hash,
                }
            );
            return res.json({
                success: true,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    changeemailrequest: async (req, res) => {
        try {
            const { errors, isValid } = validateLoginInput(req.body);

            if (!isValid) {
                return res.status(400).json(errors);
            }

            const id = req.user.id;
            const { email, password } = req.body;
            const user = await User.findOne({ id });
            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            }
            // CHECK PASSWORD
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    passwordCurrent: "Password is incorrect",
                });
            }
            // CHECK IF ACCOUNT WITH THIS EMAIL EXISTS
            const newUser = await User.findOne({ email });
            if (newUser) {
                return res.status(400).json({
                    email: "User with this email address exists",
                });
            }
            const salt = await bcrypt.genSalt(10);
            let code = "";
            for (let i = 0; i < 4; i++) {
                code += JSON.stringify(Math.floor(Math.random() * 10));
            }
            const hash = await bcrypt.hash(code, salt);
            const codeObject = await TemporaryCode.findOne({
                userId: id,
            });
            if (codeObject) {
                await TemporaryCode.findOneAndUpdate(
                    {
                        userId: id,
                    },
                    {
                        code: hash,
                        email,
                    }
                );
            } else {
                const newObject = new TemporaryCode({
                    email,
                    userId: id,
                    code: hash,
                });
                newObject.save();
            }
            sendEmail(
                email,
                "Change email",
                templates.emailChangeTemplate({
                    name: user.name,
                    code,
                }),
                (err, data) => {
                    if (err) {
                        return res.status(400).json({
                            msg: "Email change mail cannot be delivered.",
                        });
                    }
                    console.log("Change email sent!");
                    return res.json({
                        msg: "Change email sent.",
                    });
                }
            );
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    changeemail: async (req, res) => {
        try {
            const id = req.user.id;
            const { code } = req.body;
            const user = await TemporaryCode.findOne({
                userId: id,
            });
            if (!user) {
                return res.status(400).json({ msg: "The code is expired" });
            }
            const isMatch = await bcrypt.compare(code, user.code);

            if (!isMatch) {
                return res.status(400).json({ code: "The code is incorrect" });
            }
            await User.findOneAndUpdate(
                {
                    _id: id,
                },
                {
                    email: user.email,
                },
                { new: true }
            );
            await TemporaryCode.deleteOne({
                userId: id,
            });
            res.json({
                success: true,
                msg: "Email changed successfully",
                // token: `Bearer ${token}`,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    changename: async (req, res) => {
        try {
            const id = req.user.id;
            const { name } = req.body;
            await User.findOneAndUpdate(
                { _id: id },
                {
                    name,
                }
            );
            res.json({ msg: "Update Success!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteaccount: async (req, res) => {
        try {
            const id = req.user.id;
            const { password } = req.body;
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({
                    msg: "Account can't be deleted.",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(404).json({
                    passwordCurrent: "Password is incorrect.",
                });
            }
            await TemporaryCode.deleteOne({ userId: id });
            await TemporaryPassword.deleteOne({
                email: user.email,
            });
            await User.findByIdAndDelete(id);
            return res.json({ success: true });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    upload: (req, res) => {
        var dUri = new Datauri();
        let place = req.file.originalname.split("_", 1);
        const uniqueFilename = new Date().toISOString();
        dUri.format(".webp", req.file.buffer);
        cloudinary.uploader
            .upload(dUri.content, {
                public_id: `qrspots/${place}/layouts/${uniqueFilename}`,
            })
            .then((image) => {
                User.findByIdAndUpdate(
                    place,
                    {
                        $push: {
                            layouts: {
                                background_url: image.url,
                                name: "Layout",
                                _id: uniqueFilename,
                            },
                        },
                    },
                    { new: true }
                )
                    .then((user) => {
                        return res.json(user.layouts);
                    })
                    .catch((err) => {
                        return res.status(404).json(err);
                    });
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");

            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = userCtrl;
