const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const templates = require("../templates/emails");
const nodemailer = require("nodemailer");
var Datauri = require("datauri");
const short = require("shortid");
const mongoose = require("mongoose");
const fs = require("fs");
const clientIp = require("client-ip");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MULTER
const multer = require("multer");
const storage = multer.memoryStorage();

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const TemporaryUser = require("../models/TemporaryUser");
const TemporaryPassword = require("../models/TemporaryPassword");
const TemporaryCode = require("../models/TemporaryCode");
const User = require("../models/User");
const Point = require("../models/Point");
const Call = require("../models/Call");
const Order = require("../models/Order");
const Session = require("../models/Session");
const Layout = require("../models/Layout");
const Menu = require("../models/Menu");

router.post("/register", function (req, res) {
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
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) {
                                    console.error("There was an error", err);
                                    return res.status(400).json({
                                        backend:
                                            "The error occured while encrypting the password",
                                    });
                                } else {
                                    newUser.password = hash;
                                    newUser.save().then((user) => {
                                        let mailOptions = {
                                            from: "spoorciakk@gmail.com",
                                            to: user.email,
                                            subject: "Activation",
                                            html: templates.activateTemplate({
                                                name: user.name,
                                                id: user._id,
                                            }),
                                        };
                                        transporter.sendMail(
                                            mailOptions,
                                            (err, data) => {
                                                if (err) {
                                                    TemporaryUser.deleteOne({
                                                        email: user.email,
                                                    }).then(() => {
                                                        console.log(err);
                                                        return res
                                                            .status(400)
                                                            .json({
                                                                email: "The activation email could not be delivered",
                                                            });
                                                    });
                                                } else {
                                                    console.log("Email sent!");
                                                    return res.json(
                                                        "Activation email sent."
                                                    );
                                                }
                                            }
                                        );
                                    });
                                }
                            });
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
});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                TemporaryUser.findOne({
                    email: req.body.email,
                }).then((user) => {
                    if (user) {
                        return res.status(400).json({
                            email: "Email is waiting for activation.",
                        });
                    } else {
                        errors.email = "Email or password is incorrect";
                        errors.password = "Email or password is incorrect";
                        return res.status(404).json(errors);
                    }
                });
            } else {
                bcrypt
                    .compare(password, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                stripeId: user.stripeId,
                                date: user.date,
                                name: user.name,
                                email: user.email,
                            };
                            jwt.sign(
                                payload,
                                process.env.LOCAL_JWT_SECRET,
                                {
                                    expiresIn: 86400,
                                },
                                (err, token) => {
                                    if (err) {
                                        console.error(
                                            "There is some error in token.",
                                            err
                                        );
                                    } else {
                                        res.json({
                                            success: true,
                                            token: `Bearer ${token}`,
                                        });
                                    }
                                }
                            );
                        } else {
                            errors.email = "Email or password is incorrect.";
                            errors.password = "Email or password is incorrect.";
                            return res.status(400).json(errors);
                        }
                    })
                    .catch((err) => {
                        return res.status(404).json({
                            email: "Email or password is incorrect.",
                        });
                    });
            }
        })
        .catch((err) => {
            return res.status(404).json({
                email: "Email or password is incorrect.",
            });
        });
});

router.post("/forgotpassword", function (req, res) {
    User.findOne({
        email: req.body.email,
    }).then((user) => {
        if (user) {
            TemporaryPassword.findOne({
                email: req.body.email,
            }).then((temporaryUser) => {
                const temporary = (prevUser) => {
                    const newPassword = new TemporaryPassword({
                        email: prevUser.email,
                        _id: short.generate(),
                    });
                    newPassword.save().then((updatedUser) => {
                        let mailOptions = {
                            from: "spoorciakk@gmail.com",
                            to: updatedUser.email,
                            subject: "Reset password",
                            // text: 'Please click here to reset your password: http://goals-io.herokuapp.com/reset/' + updatedUser._id,
                            html: templates.forgotTemplate({
                                name: user.name,
                                id: updatedUser._id,
                            }),
                        };
                        transporter.sendMail(mailOptions, (err, data) => {
                            if (err) {
                                return res.status(400).json({
                                    email: "Reset password mail cannot be delivered.",
                                });
                            }
                            console.log("Reset email sent!");
                            return res.json("Reset password email sent.");
                        });
                    });
                };
                if (temporaryUser) {
                    TemporaryPassword.deleteOne({
                        email: req.body.email,
                    }).then((user) => {
                        temporary(req.body);
                    });
                } else {
                    temporary(req.body);
                }
            });
        } else {
            return res.status(400).json({
                email: "This email was not recognized.",
            });
        }
    });
});

router.post("/activate", (req, res) => {
    TemporaryUser.findOne({
        _id: req.body.id,
    })
        .then((tempUser) => {
            if (tempUser) {
                User.findOne({
                    email: tempUser.email,
                }).then(async (user) => {
                    if (user) {
                        return res.status(400).json({
                            activation:
                                "Account with this email is already active.",
                        });
                    } else {
                        try {
                            const stripe_customer =
                                await stripe.customers.create({
                                    email: tempUser.email,
                                });
                            const newUser = new User({
                                name: tempUser.name,
                                email: tempUser.email,
                                password: tempUser.password,
                                date: tempUser.date,
                                stripeCustomerId: stripe_customer.id,
                            });
                            newUser.save().then((user) => {
                                TemporaryUser.deleteOne({
                                    _id: req.body.id,
                                }).then((toBeDeleted) => {
                                    const payload = {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                    };
                                    jwt.sign(
                                        payload,
                                        process.env.LOCAL_JWT_SECRET,
                                        {
                                            expiresIn: 86400,
                                        },
                                        (err, token) => {
                                            if (err) {
                                                console.error(
                                                    "There is some error in token",
                                                    err
                                                );
                                                return res.status(400).json({
                                                    activation:
                                                        "Some token error occured.",
                                                });
                                            } else {
                                                res.json({
                                                    success: true,
                                                    token: `Bearer ${token}`,
                                                });
                                            }
                                        }
                                    );
                                });
                            });
                        } catch (err) {
                            return res.send({
                                success: false,
                                message: `Error: ${err.message}`,
                            });
                        }
                    }
                });
            } else {
                return res
                    .status(404)
                    .json({ activation: "The activation link is invalid." });
            }
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ activation: "The activation link is invalid." });
        });
});

router.post("/isresetvalid", (req, res) => {
    TemporaryPassword.findOne({
        _id: req.body.id,
    }).then((tempUser) => {
        if (tempUser) {
            res.json("Valid reset attempt");
        } else {
            res.status(404).json("Invalid reset attempt");
        }
    });
});

router.post("/reset", (req, res) => {
    TemporaryPassword.findOne({
        _id: req.body.id,
    })
        .then((tempUser) => {
            if (tempUser) {
                User.findOne({
                    email: tempUser.email,
                }).then((user) => {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            return res.status(404).json({
                                reset: "The password couldn't be changed.",
                            });
                        } else {
                            bcrypt.hash(
                                req.body.password,
                                salt,
                                (err, hash) => {
                                    if (err) {
                                        return res.status(404).json({
                                            reset: "The password couldn't be changed.",
                                        });
                                    } else {
                                        User.findOneAndUpdate(
                                            {
                                                email: tempUser.email,
                                            },
                                            {
                                                password: hash,
                                            },
                                            {
                                                new: true,
                                            }
                                        ).then((user) => {
                                            TemporaryPassword.deleteOne({
                                                _id: req.body.id,
                                            }).then((user) => {
                                                return res.json(
                                                    "Password changed."
                                                );
                                            });
                                        });
                                    }
                                }
                            );
                        }
                    });
                });
            } else {
                return res
                    .status(404)
                    .json({ reset: "The password reset link is invalid." });
            }
        })
        .catch((err) => {
            return res
                .status(404)
                .json({ reset: "The password reset link is invalid." });
        });
});

router.post("/changepassword", (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
            if (isMatch) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error("There was an error", err);
                    } else {
                        bcrypt.hash(
                            req.body.new_password,
                            salt,
                            (err, hash) => {
                                if (err) {
                                    console.error("There was an error", err);
                                } else {
                                    User.updateOne(
                                        { _id: req.body.id },
                                        {
                                            password: hash,
                                        }
                                    )
                                        .then((user) => {
                                            return res.json({
                                                success: true,
                                            });
                                        })
                                        .catch((err) => {
                                            return res.status(404).json({
                                                password:
                                                    "Password couldn't be changed.",
                                            });
                                        });
                                }
                            }
                        );
                    }
                });
            } else {
                return res
                    .status(400)
                    .json({ passwordCurrent: "Incorrect Password" });
            }
        });
    });
});

router.post(
    "/changeemailrequest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findById(req.body.id)
            .then((user) => {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            User.findOne({ email: req.body.email })
                                .then((nextUser) => {
                                    if (nextUser) {
                                        return res.status(404).json({
                                            email: "Email address belongs to another user",
                                        });
                                    } else {
                                        bcrypt.genSalt(10, (err, salt) => {
                                            if (err) {
                                                return res.status(404).json({
                                                    email: "Email couldn't be changed. Refresh the page and try again.",
                                                });
                                            } else {
                                                let code = "";
                                                for (let i = 0; i < 4; i++) {
                                                    code += JSON.stringify(
                                                        Math.floor(
                                                            Math.random() * 10
                                                        )
                                                    );
                                                }
                                                bcrypt.hash(
                                                    code,
                                                    salt,
                                                    (err, hash) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res
                                                                .status(404)
                                                                .json({
                                                                    email: "Email couldn't be changed. Refresh the page and try again.",
                                                                });
                                                        } else {
                                                            TemporaryCode.findOne(
                                                                {
                                                                    userId: req
                                                                        .body
                                                                        .id,
                                                                }
                                                            )
                                                                .then(
                                                                    (
                                                                        codeObject
                                                                    ) => {
                                                                        const sendEmail =
                                                                            (
                                                                                code
                                                                            ) => {
                                                                                let mailOptions =
                                                                                    {
                                                                                        from: "spoorciakk@gmail.com",
                                                                                        to: req
                                                                                            .body
                                                                                            .email,
                                                                                        subject:
                                                                                            "Change email",
                                                                                        // text: 'Your change email code is: ' + code
                                                                                        html: templates.emailChangeTemplate(
                                                                                            {
                                                                                                name: user.name,
                                                                                                code,
                                                                                            }
                                                                                        ),
                                                                                    };
                                                                                transporter.sendMail(
                                                                                    mailOptions,
                                                                                    (
                                                                                        err,
                                                                                        data
                                                                                    ) => {
                                                                                        if (
                                                                                            err
                                                                                        ) {
                                                                                            return res
                                                                                                .status(
                                                                                                    400
                                                                                                )
                                                                                                .json(
                                                                                                    {
                                                                                                        invite: "Email change mail cannot be delivered.",
                                                                                                    }
                                                                                                );
                                                                                        } else {
                                                                                            return res.json(
                                                                                                "Email change email sent."
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                );
                                                                            };
                                                                        if (
                                                                            codeObject
                                                                        ) {
                                                                            TemporaryCode.findOneAndUpdate(
                                                                                {
                                                                                    userId: req
                                                                                        .body
                                                                                        .id,
                                                                                },
                                                                                {
                                                                                    code: hash,
                                                                                    email: req
                                                                                        .body
                                                                                        .email,
                                                                                }
                                                                            )
                                                                                .then(
                                                                                    (
                                                                                        codeObject
                                                                                    ) => {
                                                                                        sendEmail(
                                                                                            code
                                                                                        );
                                                                                    }
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        err
                                                                                    ) => {
                                                                                        console.log(
                                                                                            err
                                                                                        );
                                                                                        return res
                                                                                            .status(
                                                                                                404
                                                                                            )
                                                                                            .json(
                                                                                                {
                                                                                                    email: "Email couldn't be changed. Refresh the page and try again.",
                                                                                                }
                                                                                            );
                                                                                    }
                                                                                );
                                                                        } else {
                                                                            const newObject =
                                                                                new TemporaryCode(
                                                                                    {
                                                                                        email: req
                                                                                            .body
                                                                                            .email,
                                                                                        userId: req
                                                                                            .body
                                                                                            .id,
                                                                                        code: hash,
                                                                                    }
                                                                                );
                                                                            newObject
                                                                                .save()
                                                                                .then(
                                                                                    (
                                                                                        codeObject
                                                                                    ) => {
                                                                                        sendEmail(
                                                                                            code
                                                                                        );
                                                                                    }
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        err
                                                                                    ) => {
                                                                                        console.log(
                                                                                            err
                                                                                        );
                                                                                        return res
                                                                                            .status(
                                                                                                404
                                                                                            )
                                                                                            .json(
                                                                                                {
                                                                                                    email: "Email couldn't be changed. Refresh the page and try again.",
                                                                                                }
                                                                                            );
                                                                                    }
                                                                                );
                                                                        }
                                                                    }
                                                                )
                                                                .catch(
                                                                    (err) => {
                                                                        console.log(
                                                                            err
                                                                        );
                                                                        return res
                                                                            .status(
                                                                                404
                                                                            )
                                                                            .json(
                                                                                {
                                                                                    email: "Email couldn't be changed. Refresh the page and try again.",
                                                                                }
                                                                            );
                                                                    }
                                                                );
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(404).json({
                                        email: "Email couldn't be changed. Refresh the page and try again.",
                                    });
                                });
                        } else {
                            return res.status(404).json({
                                passwordCurrent: "Password is incorrect.",
                            });
                        }
                    })
                    .catch((err) => {
                        return res.status(404).json({
                            passwordCurrent: "Password is incorrect.",
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                return res.status(404).json({
                    email: "Email couldn't be changed. Refresh the page and try again.",
                });
            });
    }
);

router.post(
    "/changeemail",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        TemporaryCode.findOne({
            userId: req.body.id,
        }).then((user) => {
            if (user) {
                bcrypt.compare(req.body.code, user.code).then((isMatch) => {
                    if (isMatch) {
                        User.findOneAndUpdate(
                            {
                                _id: user.userId,
                            },
                            {
                                email: user.email,
                            },
                            { new: true }
                        ).then((newUser) => {
                            TemporaryCode.deleteOne({
                                userId: req.body.id,
                            }).then((user) => {
                                const payload = {
                                    id: newUser._id,
                                    name: newUser.name,
                                    email: newUser.email,
                                };
                                jwt.sign(
                                    payload,
                                    process.env.LOCAL_JWT_SECRET,
                                    {
                                        expiresIn: 86400,
                                    },
                                    (err, token) => {
                                        if (err) {
                                            console.error(
                                                "There is some error in token.",
                                                err
                                            );
                                        } else {
                                            res.json({
                                                success: true,
                                                token: `Bearer ${token}`,
                                            });
                                        }
                                    }
                                );
                            });
                        });
                    } else {
                        return res
                            .status(400)
                            .json({ code: "The code is incorrect" });
                    }
                });
            } else {
                return res.status(400).json({ code: "The code is incorrect" });
            }
        });
    }
);

router.post(
    "/changename",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
            },
            { new: true }
        )
            .then((newUser) => {
                const payload = {
                    id: req.body.id,
                    name: req.body.name,
                    email: newUser.email,
                };
                jwt.sign(
                    payload,
                    process.env.LOCAL_JWT_SECRET,
                    {
                        expiresIn: 86400,
                    },
                    (err, token) => {
                        if (err) {
                            console.error("There is some error in token.", err);
                            return res
                                .status(400)
                                .json({ name: "Name couldn't be changed" });
                        } else {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`,
                            });
                        }
                    }
                );
            })
            .catch((err) => {
                return res
                    .status(400)
                    .json({ name: "Name couldn't be changed" });
            });
    }
);

router.post(
    "/deleteaccount",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findOne({ _id: req.body.id }).then((user) => {
            bcrypt
                .compare(req.body.password, user.password)
                .then(async (isMatch) => {
                    if (isMatch) {
                        await Call.deleteMany({ place: req.body.id });
                        await Menu.deleteMany({ place: req.body.id });
                        await Menu.deleteMany({ place: req.body.id });
                        await Order.deleteMany({ place: req.body.id });
                        await Point.deleteMany({ place: req.body.id });
                        await Session.deleteMany({ placeId: req.body.id });
                        await TemporaryCode.deleteOne({ userId: req.body.id });
                        await TemporaryPassword.deleteOne({
                            email: user.email,
                        });
                        await User.findByIdAndDelete(req.body.id);
                        //Doesn't really work
                        await cloudinary.api.delete_resources([
                            `qrspots/${req.body.place}`,
                        ]);
                        return res.json({ success: true });
                    } else {
                        return res
                            .status(400)
                            .json({ passwordCurrent: "Incorrect Password" });
                    }
                });
        });
    }
);

router.post(
    "/adddesktopuser",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findById(req.body.place)
            .then((user) => {
                if (
                    user.users.filter(
                        (user) => user.username === req.body.user.username
                    ).length > 0
                ) {
                    return res.status(400).json({
                        username: "User with this username already exists",
                    });
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            console.error("There was an error", err);
                            return res.status(400).json({
                                username: "Password couldn't be encrypted",
                            });
                        } else {
                            bcrypt.hash(
                                req.body.user.password,
                                salt,
                                (err, hash) => {
                                    if (err) {
                                        console.error(
                                            "There was an error",
                                            err
                                        );
                                        return res.status(400).json({
                                            username:
                                                "Password couldn't be encrypted",
                                        });
                                    } else {
                                        req.body.user.password = hash;
                                        User.findByIdAndUpdate(req.body.place, {
                                            $push: { users: req.body.user },
                                        })
                                            .then((user) => {
                                                return res.json({
                                                    success: true,
                                                });
                                            })
                                            .catch((err) => {
                                                console.error(
                                                    "There was an error",
                                                    err
                                                );
                                                return res.status(400).json({
                                                    username:
                                                        "User couldn't be added.",
                                                });
                                            });
                                    }
                                }
                            );
                        }
                    });
                }
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ username: "User couldn't be added." });
            });
    }
);

router.post(
    "/editdesktopusername",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findById(req.body.place)
            .then((user) => {
                if (
                    user.users.filter(
                        (user) => user.username === req.body.user.username
                    ).length > 0
                ) {
                    return res.status(400).json({
                        username: "User with this username already exists",
                    });
                } else {
                    User.findOneAndUpdate(
                        { _id: req.body.place, "users.id": req.body.user.id },
                        { $set: { "users.$.username": req.body.user.username } }
                    )
                        .then((user) => {
                            return res.json({ success: true });
                        })
                        .catch((err) => {
                            console.error("There was an error", err);
                            return res.status(400).json({
                                username: "Username couldn't be edited.",
                            });
                        });
                }
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ username: "User couldn't be added." });
            });
    }
);

router.post(
    "/editdesktopuserpassword",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findById(req.body.place)
            .then((user) => {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error("There was an error", err);
                        return res.status(400).json({
                            password: "Password couldn't be encrypted",
                        });
                    } else {
                        bcrypt.hash(
                            req.body.user.password,
                            salt,
                            (err, hash) => {
                                if (err) {
                                    console.error("There was an error", err);
                                    return res.status(400).json({
                                        password:
                                            "Password couldn't be encrypted",
                                    });
                                } else {
                                    User.findOneAndUpdate(
                                        {
                                            _id: req.body.place,
                                            "users.id": req.body.user.id,
                                        },
                                        { $set: { "users.$.password": hash } }
                                    )
                                        .then((user) => {
                                            return res.json({ success: true });
                                        })
                                        .catch((err) => {
                                            console.error(
                                                "There was an error",
                                                err
                                            );
                                            return res.status(400).json({
                                                password:
                                                    "User couldn't be added.",
                                            });
                                        });
                                }
                            }
                        );
                    }
                });
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ username: "User couldn't be added." });
            });
    }
);

router.post(
    "/removedesktopuser",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findByIdAndUpdate(req.body.place, {
            $pull: { users: { id: req.body.userId } },
        })
            .then((user) => {
                return res.json({ success: true });
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ username: "User couldn't be removed." });
            });
    }
);

router.post(
    "/fetchmanagerdata",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findById(req.body.place).then((user) => {
            User.aggregate([
                { $match: { _id: mongoose.mongo.ObjectId(req.body.place) } },
                { $unwind: "$users" },
                {
                    $project: {
                        _id: 0,
                        id: "$users.id",
                        username: "$users.username",
                    },
                },
            ])
                .then(async (users) => {
                    let paymentMethod = {
                        billing_details: {
                            email: "",
                            name: "",
                            phone: "",
                        },
                        card: {
                            brand: "",
                            exp_month: "",
                            exp_year: "",
                            last4: "",
                        },
                    };
                    let default_payment_method = "";
                    let personal_customer_details = {};
                    let personal_customer_details_address = {
                        city: "",
                        country: "",
                        addressLineOne: "",
                        addressLineTwo: "",
                        postalCode: "",
                        state: "",
                    };
                    if (user.stripeCustomerId !== "") {
                        const customer = await stripe.customers.retrieve(
                            user.stripeCustomerId
                        );
                        personal_customer_details = {
                            name:
                                typeof customer.name === "string"
                                    ? customer.name
                                    : "",
                            email:
                                typeof customer.email === "string"
                                    ? customer.email
                                    : "",
                            phoneNumber:
                                typeof customer.phone === "string"
                                    ? customer.phone
                                    : "",
                        };
                        if (typeof customer.address !== "undefined") {
                            personal_customer_details_address = {
                                city:
                                    typeof customer.address.city === "string"
                                        ? customer.address.city
                                        : "",
                                country:
                                    typeof customer.address.country === "string"
                                        ? customer.address.country
                                        : "",
                                addressLineOne:
                                    typeof customer.address.line1 === "string"
                                        ? customer.address.line1
                                        : "",
                                addressLineTwo:
                                    typeof customer.address.line2 === "string"
                                        ? customer.address.line2
                                        : "",
                                postalCode:
                                    typeof customer.address.postal_code ===
                                    "string"
                                        ? customer.address.postal_code
                                        : "",
                                state:
                                    typeof customer.address.state === "string"
                                        ? customer.address.state
                                        : "",
                            };
                        }
                        personal_customer_details = {
                            ...personal_customer_details,
                            ...personal_customer_details_address,
                        };
                        default_payment_method =
                            customer.invoice_settings.default_payment_method;
                        if (default_payment_method) {
                            paymentMethodDetails =
                                await stripe.paymentMethods.retrieve(
                                    default_payment_method
                                );
                            paymentMethod = {
                                billing_details: {
                                    email: paymentMethodDetails.billing_details
                                        .email,
                                    name: paymentMethodDetails.billing_details
                                        .name,
                                    phone: paymentMethodDetails.billing_details
                                        .phone,
                                },
                                card: {
                                    brand: paymentMethodDetails.card.brand,
                                    exp_month:
                                        paymentMethodDetails.card.exp_month,
                                    exp_year:
                                        paymentMethodDetails.card.exp_year,
                                    last4: paymentMethodDetails.card.last4,
                                },
                            };
                        }
                    }
                    res.json({
                        users,
                        currency: user.currency,
                        language: user.language,
                        stripeId: user.stripeId,
                        stripeCustomerId: user.stripeCustomerId,
                        default_payment_method,
                        paymentMethod,
                        personal_customer_details,
                    });
                })
                .catch((err) => {
                    console.error("There was an error", err);
                    return res.status(400).json({ success: false });
                });
        });
    }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/desktoplogin", (req, res) => {
    console.log("desktop login");
    var errors = {};
    const placeId = req.body.placeId;
    const username = req.body.username.toLowerCase().trim();
    const password = req.body.password;
    User.findOne({ _id: placeId })
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    placeId: "Place ID is wrong.",
                });
            } else {
                let users = user.users.filter(
                    (user) => user.username === username
                );
                if (users.length === 0) {
                    errors.username = "Username or password is incorrect.";
                    errors.password = "Username or password is incorrect.";
                    return res.status(400).json(errors);
                } else {
                    bcrypt
                        .compare(password, users[0].password)
                        .then((isMatch) => {
                            if (isMatch) {
                                const payload = {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                };
                                jwt.sign(
                                    payload,
                                    process.env.LOCAL_JWT_SECRET,
                                    {
                                        expiresIn: 86400,
                                    },
                                    (err, token) => {
                                        if (err) {
                                            console.error(
                                                "There is some error in token.",
                                                err
                                            );
                                        } else {
                                            res.json({
                                                success: true,
                                                token: `Bearer ${token}`,
                                            });
                                        }
                                    }
                                );
                            } else {
                                errors.username =
                                    "Username or password is incorrect.";
                                errors.password =
                                    "Username or password is incorrect.";
                                return res.status(400).json(errors);
                            }
                        });
                }
            }
        })
        .catch((err) => {
            return res.status(404).json({
                placeId: "Place ID is wrong.",
            });
        });
});

router.post(
    "/getorders",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Order.find({ place: req.body.place })
            .then((orders) => {
                Call.find({ place: req.body.place })
                    .then((calls) => {
                        return res.json([...orders, ...calls]);
                    })
                    .catch((err) => {
                        return res.status(400).json("Something went wrong");
                    });
            })
            .catch((err) => {
                return res.status(400).json("Something went wrong");
            });
    }
);

router.post(
    "/fetchcurrentuserdata",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findOne({ _id: req.body.id })
            .then((user) => {
                Menu.find({ place: req.body.id })
                    .then((menus) => {
                        Order.find({ place: req.body.id, open: true })
                            .then((orders) => {
                                Point.find({ place: req.body.id })
                                    .then((points) => {
                                        Layout.find({ place: req.body.id })
                                            .then((layouts) => {
                                                let todayTime =
                                                    new Date().setHours(
                                                        0,
                                                        0,
                                                        0,
                                                        0
                                                    );
                                                Session.aggregate([
                                                    {
                                                        $match: {
                                                            placeId:
                                                                req.body.id,
                                                        },
                                                    },
                                                    {
                                                        $facet: {
                                                            mobileVendors: [
                                                                {
                                                                    $group: {
                                                                        _id: "$mobileVendor",
                                                                        value: {
                                                                            $sum: 1,
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                            mobileModels: [
                                                                {
                                                                    $group: {
                                                                        _id: "$mobileModel",
                                                                        value: {
                                                                            $sum: 1,
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                            browserNames: [
                                                                {
                                                                    $group: {
                                                                        _id: "$browserName",
                                                                        value: {
                                                                            $sum: 1,
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                            languages: [
                                                                {
                                                                    $group: {
                                                                        _id: "$language",
                                                                        value: {
                                                                            $sum: 1,
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                            sessions: [
                                                                {
                                                                    $group: {
                                                                        _id: {
                                                                            $dateToString:
                                                                                {
                                                                                    format: "%Y-%m-%d",
                                                                                    date: "$createdAt",
                                                                                },
                                                                        },
                                                                        value: {
                                                                            $sum: 1,
                                                                        },
                                                                        paid: {
                                                                            $sum: {
                                                                                $cond: [
                                                                                    {
                                                                                        $eq: [
                                                                                            "$paid",
                                                                                            true,
                                                                                        ],
                                                                                    },
                                                                                    1,
                                                                                    0,
                                                                                ],
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                            today: [
                                                                {
                                                                    $limit: 1000,
                                                                },
                                                                // { $match: { openTime: { $gte: todayTime } } },
                                                                {
                                                                    $group: {
                                                                        _id: null,
                                                                        count: {
                                                                            $sum: 1,
                                                                        },
                                                                        data: {
                                                                            $push: "$$ROOT",
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ])
                                                    .then((sessions) => {
                                                        return res.json({
                                                            columns:
                                                                user.columns,
                                                            selectedMenu:
                                                                user.menu,
                                                            workUnits:
                                                                user.workUnits,
                                                            points,
                                                            menus,
                                                            orders,
                                                            layouts,
                                                            sessions:
                                                                sessions[0],
                                                            currency:
                                                                user.currency,
                                                            language:
                                                                user.language,
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                        return res
                                                            .status(400)
                                                            .json(
                                                                "Something went wrong"
                                                            );
                                                    });
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                return res
                                                    .status(400)
                                                    .json(
                                                        "Something went wrong"
                                                    );
                                            });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res
                                            .status(400)
                                            .json("Something went wrong");
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                return res
                                    .status(400)
                                    .json("Something went wrong");
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(400).json("Something went wrong");
                    });
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json("Something went wrong");
            });
    }
);

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2.5 },
    fileFilter,
});
router.post(
    "/upload",
    passport.authenticate("jwt", { session: false }),
    upload.single("layoutImage"),
    (req, res) => {
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
    }
);
router.post(
    "/removelayout",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        User.findByIdAndUpdate(
            req.body.place,
            {
                $pull: {
                    layouts: {
                        _id: req.body.layoutId,
                    },
                },
            },
            { new: true }
        )
            .then((user) => {
                cloudinary.api
                    .delete_resources([
                        `qrspots/${place}layouts/${req.body.layoutId}`,
                    ])
                    .then(() => {
                        return res.json(user.layouts);
                    })
                    .catch((err) => {
                        return res.status(404).json(err);
                    });
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    }
);

router.post("/fetchqrdata", async (req, res) => {
    var data = {
        //Point
        pointId: "",
        pointName: "",
        pointFeature: "",
        //Layout
        layoutId: "",
        layoutName: "",
        //Place
        placeId: "",
        placeName: "",
        placeMenu: {},
        surveys: [],
        review: "",
        rating: 0,
        //Flags
        isInTestMode: false,
        exists: false,
        open: true,
        surveysPassed: false,
        //Order
        openDate: "",
        closeDate: "",
        total: 0,
    };
    let order, call, point, layout, place, menu;
    try {
        order = await Order.findById(req.body.sessionId);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }

    if (order) {
        data.pointId = order.point;
        data.pointName = order.pointName;
        data.pointFeature = order.feature;
        data.layoutId = order.layout;
        data.layoutName = order.layoutName;
        data.placeId = order.place;
        data.placeName = order.placeName;
        data.isInTestMode = false;
        data.exists = true;
        data.open = order.open;
        data.ready = order.ready;
        data.paid = order.paid;
        data.surveysPassed = order.surveysPassed;
        data.openDate = order.openDate;
        data.closeDate = order.closeDate;
        data.total = order.total;
        data.collectId = order.collectId;
        data.review = order.review;
        data.rating = order.rating;
        if (data.surveysPassed) {
            data.surveys = order.surveys;
        }
        return res.json(data);
    } else {
        try {
            call = await Call.findById(req.body.sessionId);
        } catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
        if (call) {
            data.pointFeature = call.feature;
            data.exists = true;
            data.openDate = call.openDate;
            data.closeDate = call.closeDate;
            return res.json(call);
        } else {
            try {
                point = await Point.findById(req.body.pointId);
                layout = await Layout.findById(point.layout);
                place = await User.findById(point.place);
                menu = await Menu.findById(place.menu);
            } catch (err) {
                console.log(err);
                return res.status(404).json(err);
            }
            if (point) {
                data.pointId = point._id;
                data.pointName = point.name;
                data.pointFeature = point.feature;
                try {
                    layout = await Layout.findById(point.layout);
                    place = await User.findById(point.place);
                } catch (err) {
                    console.log(err);
                    return res.status(404).json(err);
                }
                if (layout) {
                    data.layoutId = layout._id;
                    data.layoutName = layout.name;
                }
                data.placeId = place._id;
                data.placeName = place.name;
                data.placeMenu = menu;
                return res.json(data);
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: "Point doesn't exist" });
            }
        }
    }
});

router.get("/clientip", (req, res) => {
    var ip = clientIp(req);
    return res.json({ ip });
});

router.get("/test", (req, res) => {
    User.findByIdAndUpdate(
        req.body.place,
        {
            $pull: {
                layouts: {
                    _id: req.body.layoutId,
                },
            },
        },
        { new: true }
    )
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

module.exports = router;
