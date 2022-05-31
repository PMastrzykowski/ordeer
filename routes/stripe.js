const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const querystring = require("querystring");
const passport = require("passport");
const uuid = require("uuid");

const { default: ShortUniqueId } = require("short-unique-id");
const options = {
    dictionary: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "W",
        "V",
        "X",
        "Y",
        "Z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ],
    shuffle: false,
    debug: false,
    length: 4,
};
const authorizeUri = "https://connect.stripe.com/express/oauth/authorize";
const publicDomain = "http://localhost:3000";

const User = require("../models/User");
const Order = require("../models/Order");

stripe.applePayDomains.create({
    domain_name: 'a696-188-26-215-18.ngrok.io'
  });

const generatedCollectId = async (place) => {
    let collectId = new ShortUniqueId(options)();
    let findings = await Order.find({ place, collectId });
    if (findings.length > 0) {
        generatedCollectId(place);
    } else {
        return collectId;
    }
};

router.post(
    "/authorize",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Generate a random string as `state` to protect from CSRF and include it in the session
        // req.session = {};
        req.session.state = Math.random().toString(36).slice(2);
        // Define the mandatory Stripe parameters: make sure to include our platform's client ID
        let parameters = {
            client_id: process.env.STRIPE_CLIENT_ID,
            state: req.session.state,
        };
        parameters = Object.assign(parameters, {
            redirect_uri: publicDomain + "/admin/dashboard",
            "stripe_user[business_type]":
                req.body.business_type || "individual",
            "stripe_user[business_name]": req.body.business_name || undefined,
            "stripe_user[first_name]": req.body.first_name || undefined,
            "stripe_user[last_name]": req.body.last_name || undefined,
            "stripe_user[email]": req.body.email || undefined,
            "stripe_user[country]": req.body.country || undefined,
        });
        res.send(authorizeUri + "?" + querystring.stringify(parameters));
    }
);

router.post(
    "/token",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
        // Check the `state` we got back equals the one we generated before proceeding (to protect from CSRF)
        if (req.session.state != req.body.state) {
            return res.send({
                success: false,
                message: `Session state doesn't match`,
            });
        }
        try {
            const expressAuthorized = await stripe.oauth.token({
                grant_type: "authorization_code",
                code: req.body.code,
            });
            if (expressAuthorized.error) {
                throw expressAuthorized.error;
            }

            User.findByIdAndUpdate(req.body.userId, {
                stripeId: expressAuthorized.stripe_user_id,
            }).then(() => {
                res.send({
                    success: true,
                    userId: expressAuthorized.stripe_user_id,
                });
            });
        } catch (err) {
            console.log("The Stripe onboarding process has not succeeded.");
            next(err);
        }
    }
);

/**
 * GET /pilots/stripe/dashboard
 *
 * Redirect to the pilots' Stripe Express dashboard to view payouts and edit account details.
 */
router.post(
    "/account",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const loginLink = await stripe.accounts.createLoginLink(
                req.body.stripeId,
                {
                    redirect_url: `${publicDomain}/admin/dashboard`,
                }
            );
            loginLink.url = `${loginLink.url}${req.body.tab}`;
            return res.send({
                success: true,
                url: loginLink.url,
            });
        } catch (err) {
            return res.send({
                success: false,
                message: `Error: ${err.message}`,
            });
        }
    }
);

/**
 * POST /pilots/stripe/payout
 *
 * Generate an instant payout with Stripe for the available balance.
 */
router.post(
    "/payout",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            // Fetch the account balance to determine the available funds
            const balance = await stripe.balance.retrieve({
                stripeAccount: req.body.stripeId,
            });
            // This demo app only uses USD so we'll just use the first available balance
            // (Note: there is one balance for each currency used in your application)
            const { amount, currency } = balance.available[0];
            // Create an instant payout
            const payout = await stripe.payouts.create(
                {
                    amount: amount,
                    currency: currency,
                    statement_descriptor: "Order",
                },
                {
                    stripeAccount: req.body.stripeId,
                }
            );
            res.send({
                success: true,
            });
        } catch (err) {
            res.send({
                success: false,
                message: `Error: ${err.message}`,
            });
        }
    }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Returns the fields needed
router.post("/get", async (req, res) => {
    // const stripeAccountId = 'acct_1GiHR5EPRB8pRP7B';
    // const stripeAccountId = 'acct_1GieckAWA81Tv1DY'
    if (!req.body.stripeId) {
        res.send({
            success: true,
            message: "Missing stripe account.",
        });
    } else {
        try {
            const account = await stripe.accounts.retrieve(req.body.stripeId);
            const balance = await stripe.balance.retrieve({
                stripeAccount: req.body.stripeId,
            });
            res.send({
                success: true,
                account,
                balance,
            });
        } catch (err) {
            res.send({
                success: false,
                message: `Error: ${err.message}`,
            });
        }
    }
});

router.post("/checkout", (req, res) => {
    const { amount, placeId, order, method } = req.body;
    const newOrder = new Order(order);
    newOrder
        .save()
        .then(() => {
            User.findById(placeId).then(async (user) => {
                try {
                    const collectId = await generatedCollectId(placeId);
                    let updates = {
                        paymentMethod: method,
                        collectId,
                    };
                    response = {
                        success: true,
                        message: "Order saved",
                    };
                    switch (method) {
                        case "card":
                        case "p24":
                            intent = await stripe.paymentIntents.create({
                                amount,
                                currency: "pln",
                                statement_descriptor: `Ordeer`,
                                payment_method_types: [method],
                                transfer_data: {
                                    amount,
                                    destination: user.stripeId,
                                },
                            });
                            updates.intent = true;
                            response.intent = intent;
                            break;
                        case "cash":
                            updates.paid = false;
                            updates.intent = false;
                            break;
                        default:
                            null;
                    }
                    Order.findByIdAndUpdate(order._id, updates, { new: true })
                        .then((updatedOrder) => {
                            response.updatedOrder = updatedOrder;
                            res.json(response);
                        })
                        .catch((err) => {
                            res.json({
                                success: false,
                                message: `Error: charge was made but the result was not saved in the database`,
                            });
                        });
                } catch (error) {
                    res.json({ success: false, message: `Error: ${error}` });
                }
            });
        })
        .catch((err) => {
            res.json({ success: false, message: `Error: ${error}` });
        });
});
router.post("/cardSuccess", async (req, res) => {
    const { sessionId, paymentIntent } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            sessionId,
            {
                paymentData: paymentIntent,
                paid: true,
                openDate: Date.now(),
            },
            { new: true }
        );
        res.json({
            success: true,
            message: "Card success",
            updatedOrder,
        });
    } catch (error) {
        res.json({ success: false, message: `Error: ${error}` });
    }
});
router.post("/p24success", async (req, res) => {
    const { sessionId, paymentIntent } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            sessionId,
            {
                paymentData: paymentIntent,
                paid: true,
                openDate: Date.now(),
            },
            { new: true }
        );
        res.json({
            success: true,
            message: "P24 success",
            updatedOrder,
        });
    } catch (error) {
        res.json({ success: false, message: `Error: ${error}` });
    }
});
router.post(
    "/subscribe",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { stripeCustomerId, priceId, placeId } = req.body;
        try {
            const subscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
            });
            const updatedUser = await User.findByIdAndUpdate(
                placeId,
                {
                    subscriptionId: subscription.id,
                },
                { new: true }
            );
            res.json({
                success: true,
                message: `Successfully subscribed to ${priceId}`,
                updatedUser,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.post(
    "/attachpaymentmethod",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { stripeCustomerId, paymentMethod } = req.body;
        try {
            const userPaymentMethod = await stripe.paymentMethods.attach(
                paymentMethod,
                { customer: stripeCustomerId }
            );
            const customer = await stripe.customers.update(stripeCustomerId, {
                invoice_settings: { default_payment_method: paymentMethod },
            });
            res.json({
                success: true,
                message: `Successfully saved a new payment method`,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.post(
    "/detachpaymentmethod",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { stripeCustomerId, paymentMethod } = req.body;
        try {
            const userPaymentMethod = await stripe.paymentMethods.detach(
                paymentMethod
            );
            res.json({
                success: true,
                message: `Successfully detached payment method`,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.get(
    "/plans",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const products = await stripe.products.list();
            res.json({
                success: true,
                message: `Successfully received products`,
                products,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.get(
    "/prices",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const prices = await stripe.prices.list({
                limit: 100,
            });
            res.json({
                success: true,
                message: `Successfully received prices`,
                prices,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.post(
    "/updatepersonalcustomerdetails",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { stripeCustomerId, personalMetadata, taxMetadata } = req.body;
        try {
            const customer = await stripe.customers.update(
                stripeCustomerId,
                personalMetadata
            );
            res.json({
                success: true,
                message: `Successfully saved customer personaldetails`,
                customer,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);
router.post(
    "/settaxcustomerdetails",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { stripeCustomerId, taxMetadata } = req.body;
        try {
            const tax = await stripe.customers.createTaxId(
                stripeCustomerId,
                taxMetadata
            );
            res.json({
                success: true,
                message: `Successfully saved customer tax details`,
                tax,
            });
        } catch (error) {
            res.json({ success: false, message: `Error: ${error}` });
        }
    }
);

module.exports = router;
