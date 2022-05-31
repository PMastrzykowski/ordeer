const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const querystring = require("querystring");
const passport = require("passport");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const Order = require("../models/Order");
const User = require("../models/User");

router.post(
    "/gettotalclosedorders",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            let startTime = new Date(req.body.startTime);
            let endTime = new Date(req.body.endTime);
            let query = {
                place: req.body.placeId,
                openDate: {
                    $gte: startTime.getTime(),
                    $lte: endTime.getTime(),
                },
                open: false,
            };
            let total = await Order.countDocuments(query);

            return res.json({ total });
        } catch (err) {
            console.log(err);
        }
    }
);
router.post(
    "/getsomeclosedorders",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            let startTime = new Date(req.body.startTime);
            let endTime = new Date(req.body.endTime);
            let query = {
                place: req.body.placeId,
                openDate: {
                    $gte: startTime.getTime(),
                    $lte: endTime.getTime(),
                },
                open: false,
            };

            let data = await Order.find(query)
                .sort("-openDate")
                .skip(req.body.skip)
                .limit(2);

            return res.json({ data });
        } catch (err) {
            console.log(err);
        }
    }
);

router.post("/refundorder", (req, res) => {
    var errors = {};
    errors.username = "Username or password is incorrect.";
    errors.password = "Username or password is incorrect.";
    const placeId = req.body.placeId;
    const username = req.body.username.toLowerCase().trim();
    const password = req.body.password;
    const paymentId = req.body.paymentId;
    const orderId = req.body.orderId;
    const amount = req.body.amount;
    User.findOne({ _id: placeId })
        .then((user) => {
            if (!user) {
                console.log(1);
                res.json({
                    success: false,
                    errors,
                });
            } else {
                let users = user.users.filter(
                    (user) => user.username === username
                );
                console.log(2);
                console.log(users);
                if (users.length === 0) {
                    res.json({ success: false, errors });
                } else {
                    console.log(3);
                    bcrypt
                        .compare(password, users[0].password)
                        .then(async (isMatch) => {
                            if (isMatch) {
                                const refund = await stripe.refunds.create({
                                    payment_intent: paymentId,
                                    amount
                                });
                                console.log(refund);
                                let paymentRefund = {
                                    refunded: true,
                                    refundedBy: username,
                                    refundDate: Date.now(),
                                    refundData: refund
                                };
                                Order.findByIdAndUpdate(orderId, {
                                    $set: {paymentRefund}
                                })
                                    .then(() => {
                                        console.log(4);
                                        res.json({ success: true, paymentRefund });
                                    })
                                    .catch((err) => {
                                        console.log(8);
                                        console.log(err);
                                        res.json({ success: false, errors });
                                    });
                            } else {
                                console.log(5);
                                res.json({ success: false, errors });
                            }
                        });
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                errors,
            });
        });
});

module.exports = router;
