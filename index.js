require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./db");
var socket = require("socket.io");
const user = require("./routes/user");
const menu = require("./routes/menu");
const order = require("./routes/order");
const stripe = require("./routes/stripe");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const session = require("cookie-session");
const cookieParser = require("cookie-parser");

const nodemailer = require("nodemailer");
const short = require("shortid");

short.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

mongoose
    .connect(config.DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
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
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        cookie: { maxAge: 60000 },
        secret: process.env.COOKIE_SECRET,
        signed: true,
        resave: true,
    })
);

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api/users", user);
app.use("/api/menu", menu);
app.use("/api/order", order);
app.use("/api/stripe", stripe);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    app.use("*", express.static("frontend/build"));

    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    // })
}

const PORT = process.env.PORT || 5005;

var server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

//Static files
app.use(express.static("public"));

//Socket setup
var io = socket(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
      methods: ["GET", "POST"]
    }
});

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const User = require("./models/User");
const Layout = require("./models/Layout");
const Order = require("./models/Order");
const Call = require("./models/Call");
const Point = require("./models/Point");
const Session = require("./models/Session");
const Menu = require("./models/Menu");
let clients = {};

const NumberOfConnections = function () {
    return Object.keys(clients).length;
};
const validateSocket = (socket, token) => {
    jwt.verify(
        token,
        process.env.LOCAL_JWT_SECRET,
        {
            expiresIn: 86400,
        },
        (err, decoded) => {
            if (err) {
                clients[socket.id] = false;
            } else {
                clients[socket.id] = true;
            }
        }
    );
};
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        validateSocket(socket, socket.handshake.query.token);
    }
    next();
})
    .on("connection", (socket) => {
        console.log(
            `${clients[socket.id] ? "Private" : "Public"} socket connection: ${
                socket.id
            }. Number of clients: ${NumberOfConnections()}`
        );
        //Public
        socket.on("join", (place) => {
            socket.join(place);
        });
        socket.on("sessionStart", (data) => {
            const newSession = new Session(data);
            newSession.save();
        });
        socket.on("sessionEvent", (data) => {
            Session.findByIdAndUpdate(socket.id, { $push: { events: data } })
                .then(() => {})
                .catch((err) => {
                    console.log(err);
                });
        });
        socket.on("sessionPayment", (data) => {
            Session.findByIdAndUpdate(socket.id, {
                $push: { events: data },
                paid: data.success,
            })
                .then(() => {})
                .catch((err) => {
                    console.log(err);
                });
        });
        socket.on("setQrSession", (payload) => {
            socket.join(payload.placeId);
            socket.join(payload.sessionId);
        });
        socket.on("newOrder", (data) => {
            // const newOrder = new Order(data);
            // newOrder.save().then(() => {
            io.to(data.place).emit("newOrder", {
                juice: data,
                source: socket.id,
            });
            //     console.log('new order done')
            // }).catch(err => {
            //     console.log(err)
            // })
        });
        socket.on("newTestOrder", (data) => {
            io.to(data.place).emit("newTestOrder", {
                juice: data,
                source: socket.id,
            });
        });
        socket.on("closeTestOrder", (data) => {
            console.log(data);
            io.to(`${data.place}--${data._id}`).emit("closeTestOrder", {
                juice: data,
                source: socket.id,
            });
        });
        socket.on("newTestOrderRating", (data) => {
            io.to(data.place).emit("newTestOrderRating", {
                juice: data,
                source: socket.id,
            });
        });
        socket.on("newOrderRating", (data) => {
            console.log(data);
            Order.findByIdAndUpdate(data.id, {
                review: data.review,
                rating: data.rating,
                surveysPassed: true,
            })
                .then((change) => {
                    console.log(change);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        socket.on("editOrder", (data) => {
            Order.findByIdAndUpdate(data._id, { $set: data })
                .then(() => {
                    io.to(data.place).emit("editOrder", {
                        juice: data,
                        source: socket.id,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        socket.on("newCall", (payload) => {
            if (payload.exists) {
                Call.findByIdAndUpdate(
                    payload.data._id,
                    { $set: payload.data },
                    () => {
                        io.to(payload.data.place).emit("updateCall", {
                            juice: payload.data,
                            source: socket.id,
                        });
                        console.log("update call done");
                    }
                ).catch((err) => {
                    console.log(err);
                });
            } else {
                const newCall = new Call(payload.data);
                newCall
                    .save()
                    .then(() => {
                        io.to(payload.data.place).emit("newCall", {
                            juice: payload.data,
                            source: socket.id,
                        });
                        console.log("new call done");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
        //Authentication
        socket.on("login", () => {
            clients[socket.id] = true;
            console.log(
                `${
                    clients[socket.id] ? "Private" : "Public"
                } socket connection: ${
                    socket.id
                }. Number of clients: ${NumberOfConnections()}`
            );
        });
        socket.on("logout", () => {
            clients[socket.id] = false;
            console.log(
                `${
                    clients[socket.id] ? "Private" : "Public"
                } socket connection: ${
                    socket.id
                }. Number of clients: ${NumberOfConnections()}`
            );
        });
        //Users
        socket.on("usersAddNewUser", (data) => {
            console.log("new user");
        });
        //Menu
        socket.on("updateMenu", (data) => {
            if (clients[socket.id]) {
                // Menu.findByIdAndUpdate(data.menuId, { $set: data.menu }, () => {
                io.to(data.place).emit("updateMenu", {
                    juice: data,
                    source: socket.id,
                });
                // })
            }
        });
        socket.on("newMenuCategory", (data) => {
            if (clients[socket.id]) {
                // Menu.findByIdAndUpdate(data.menuId, { $push: { categories: data.category } }, () => {
                io.to(data.place).emit("newMenuCategory", {
                    juice: data,
                    source: socket.id,
                });
                // })
            }
        });
        socket.on("newMenuItem", (data) => {
            if (clients[socket.id]) {
                // Menu.findOneAndUpdate({ '_id': data.menuId, 'categories.id': data.categoryId }, { $push: { 'categories.$.items': data.item } }, () => {
                io.to(data.place).emit("newMenuItem", {
                    juice: data,
                    source: socket.id,
                });
                // })
            }
        });
        socket.on("updateMenuCategory", (data) => {
            if (clients[socket.id]) {
                // Menu.findOneAndUpdate({ '_id': data.menuId, 'categories.id': data.category.id }, { $set: { 'categories.$.name': data.category.name } }, () => {
                io.to(data.place).emit("updateMenuCategory", {
                    juice: data,
                    source: socket.id,
                });
                // })
            }
        });
        socket.on("toggleMenu", (data) => {
            if (clients[socket.id]) {
                User.findByIdAndUpdate(
                    data.place,
                    { menu: data.menuId },
                    () => {
                        io.to(data.place).emit("toggleMenu", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("updateMenuItem", (data) => {
            if (clients[socket.id]) {
                // Menu.findOneAndUpdate({ '_id': data.menuId }, { $set: { 'categories.$[category].items.$[item]': data.item } },
                // { arrayFilters: [{ 'category.id': data.categoryId }, { 'item.id': data.item.id }] }, () => {
                io.to(data.place).emit("updateMenuItem", {
                    juice: data,
                    source: socket.id,
                });
                // })
            }
        });
        socket.on("saveSpecialField", (data) => {
            if (clients[socket.id]) {
                Menu.findOneAndUpdate(
                    { _id: data.menuId },
                    {
                        $push: {
                            "items.$[item].specialFields":
                                data.field,
                        },
                    },
                    {
                        arrayFilters: [
                            { "item.id": data.itemId },
                        ],
                    },
                    () => {
                        io.to(data.place).emit("saveSpecialField", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("updateSpecialField", (data) => {
            if (clients[socket.id]) {
                Menu.findOneAndUpdate(
                    { _id: data.menuId },
                    {
                        $set: {
                            "items.$[item].specialFields.$[field]":
                                data.field,
                        },
                    },
                    {
                        arrayFilters: [
                            { "item.id": data.itemId },
                            { "field.id": data.field.id },
                        ],
                    },
                    () => {
                        io.to(data.place).emit("updateSpecialField", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("removeSpecialField", (data) => {
            if (clients[socket.id]) {
                Menu.findOneAndUpdate(
                    { _id: data.menuId },
                    {
                        $pull: {
                            "items.$[item].specialFields": {
                                id: data.fieldId,
                            },
                        },
                    },
                    {
                        arrayFilters: [
                            { "item.id": data.itemId },
                        ],
                    },
                    () => {
                        io.to(data.place).emit("removeSpecialField", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("toggleMenuItem", (data) => {
            if (clients[socket.id]) {
                Menu.findOneAndUpdate(
                    { _id: data.menuId },
                    {
                        $set: {
                            "items.$[item].available":
                                data.item.available,
                        },
                    },
                    {
                        arrayFilters: [
                            { "item.id": data.item.id },
                        ],
                    },
                    () => {
                        io.to(data.place).emit("toggleMenuItem", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("removeMenuCategory", (data) => {
            if (clients[socket.id]) {
                // Menu.findOneAndUpdate({ '_id': data.menuId }, { $pull: { categories: { id: data.categoryId } } }, () => {
                //     cloudinary.api.delete_resources_by_prefix(`qrspots/${data.place}/menus/${data.menuId}/${data.categoryId}/`)
                //         .then(() => {
                //             cloudinary.api.delete_folder(`qrspots/${data.place}/menus/${data.menuId}/${data.categoryId}`)
                //                 .then(() => {
                io.to(data.place).emit("removeMenuCategory", {
                    juice: data,
                    source: socket.id,
                });
                //                 }).catch(err => {
                //                     console.log(err)
                //                 })
                //         }).catch(err => {
                //             console.log(err)
                //         })
                // })
            }
        });
        socket.on("removeMenuItem", (data) => {
            if (clients[socket.id]) {
                // Menu.findOneAndUpdate({ '_id': data.menuId }, { $pull: { 'categories.$[category].items': { id: data.itemId } } },
                //     { arrayFilters: [{ 'category.id': data.categoryId }] }, () => {
                //         cloudinary.api.delete_resources_by_prefix(`qrspots/${data.place}/menus/${data.menuId}/${data.categoryId}/${data.itemId}/`).then(() => {
                //             cloudinary.api.delete_folder(`qrspots/${data.place}/menus/${data.menuId}/${data.categoryId}/${data.itemId}`)
                //                 .then(() => {
                io.to(data.place).emit("removeMenuItem", {
                    juice: data,
                    source: socket.id,
                });
                //             }).catch(err => {
                //                 console.log(err)
                //             })
                //     }).catch(err => {
                //         console.log(err)
                //     })
                // });
            }
        });
        //Orders
        socket.on("editOrder", (data) => {
            if (clients[socket.id]) {
                Order.findByIdAndUpdate(data._id, { $set: data }, () => {
                    io.to(data.place).emit("editOrder", {
                        juice: data,
                        source: socket.id,
                    });
                });
            }
        });
        socket.on("ordersStatusInProgress", (data) => {
            if (clients[socket.id]) {
                Order.findByIdAndUpdate(
                    data._id,
                    { ready: false, open: true },
                    () => {
                        io.to(data.place).emit("ordersStatusInProgress", {
                            juice: data,
                            source: socket.id,
                        });
                        if (typeof socket.rooms[data._id] === "undefined") {
                            socket.join(data._id, () => {
                                io.to(data._id).emit(
                                    "ordersStatusInProgressClient",
                                    {
                                        juice: data,
                                        source: socket.id,
                                    }
                                );
                            });
                        } else {
                            io.to(data._id).emit(
                                "ordersStatusInProgressClient",
                                { juice: data, source: socket.id }
                            );
                        }
                    }
                );
            }
        });
        socket.on("ordersStatusReady", (data) => {
            if (clients[socket.id]) {
                let now = Date.now();
                data.closeDate = now;
                Order.findByIdAndUpdate(
                    data._id,
                    { ready: true, open: true, closeDate: now },
                    () => {
                        io.to(data.place).emit("ordersStatusReady", {
                            juice: data,
                            source: socket.id,
                        });
                        if (typeof socket.rooms[data._id] === "undefined") {
                            socket.join(data._id, () => {
                                io.to(data._id).emit(
                                    "ordersStatusReadyClient",
                                    { juice: data, source: socket.id }
                                );
                            });
                        } else {
                            io.to(data._id).emit("ordersStatusReadyClient", {
                                juice: data,
                                source: socket.id,
                            });
                        }
                    }
                );
            }
        });
        socket.on("ordersStatusClosed", (data) => {
            if (clients[socket.id]) {
                Order.findByIdAndUpdate(
                    data._id,
                    { ready: true, open: false },
                    () => {
                        io.to(data.place).emit("ordersStatusClosed", {
                            juice: data,
                            source: socket.id,
                        });
                        if (typeof socket.rooms[data._id] === "undefined") {
                            socket.join(data._id, () => {
                                io.to(data._id).emit(
                                    "ordersStatusClosedClient",
                                    { juice: data, source: socket.id }
                                );
                            });
                        } else {
                            io.to(data._id).emit("ordersStatusClosedClient", {
                                juice: data,
                                source: socket.id,
                            });
                        }
                    }
                );
            }
        });
        socket.on("updateCall", (data) => {
            Call.findByIdAndUpdate(data._id, { $set: data }, () => {
                io.to(data.place).emit("updateCall", {
                    juice: data,
                    source: socket.id,
                });
                if (typeof socket.rooms[data._id] === "undefined") {
                    socket.join(data._id);
                }
                io.to(data._id).emit("updateCallClient", {
                    juice: data,
                    source: socket.id,
                });
                socket.leave(data._id);
            });
        });
        // socket.on('receiveOrder', (source) => {
        //     console.log('receive')
        //     if (clients[socket.id] && clients.hasOwnProperty(source)) {
        //         socket.join(source)
        //     }
        // })
        //Settings
        socket.on("SET_COLUMNS", (data) => {
            if (clients[socket.id]) {
                User.findByIdAndUpdate(
                    data.place,
                    { columns: data.columns },
                    () => {
                        io.to(data.place).emit("SET_COLUMNS", {
                            juice: data.columns,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("layoutsNewLayout", (data) => {
            if (clients[socket.id]) {
                const newLayout = new Layout(data);
                newLayout
                    .save()
                    .then(() => {
                        io.to(data.place).emit("layoutsNewLayout", {
                            juice: data,
                            source: socket.id,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
        socket.on("layoutsEditLayout", (data) => {
            if (clients[socket.id]) {
                Layout.findByIdAndUpdate(data._id, { $set: data }, () => {
                    io.to(data.place).emit("layoutsEditLayout", {
                        juice: data,
                        source: socket.id,
                    });
                });
            }
        });
        socket.on("layoutsRemoveLayout", (data) => {
            if (clients[socket.id]) {
                Point.updateMany(
                    { layout: data.layoutId },
                    { $set: { layout: "unassigned" } },
                    () => {
                        Layout.deleteOne({ _id: data.layoutId }, () => {
                            io.to(data.place).emit("layoutsRemoveLayout", {
                                juice: data,
                                source: socket.id,
                            });
                        });
                    }
                );
            }
        });
        //Points
        socket.on("createPoint", (data) => {
            if (clients[socket.id]) {
                const newPoint = new Point(data);
                newPoint
                    .save()
                    .then(() => {
                        io.to(data.place).emit("createPoint", {
                            juice: data,
                            source: socket.id,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
        socket.on("updatePoint", (data) => {
            if (clients[socket.id]) {
                Point.findByIdAndUpdate(data._id, { $set: data }, () => {
                    io.to(data.place).emit("updatePoint", {
                        juice: data,
                        source: socket.id,
                    });
                });
            }
        });
        socket.on("removePoint", (data) => {
            if (clients[socket.id]) {
                Point.deleteOne({ _id: data.pointId }, () => {
                    io.to(data.place).emit("removePoint", {
                        juice: data,
                        source: socket.id,
                    });
                });
            }
        });
        socket.on("assignPoint", (data) => {
            if (clients[socket.id]) {
            }
        });
        //Work units
        socket.on("newWorkUnit", (data) => {
            if (clients[socket.id]) {
                User.findByIdAndUpdate(
                    data.place,
                    { $push: { workUnits: data.unit } },
                    () => {
                        io.to(data.place).emit("newWorkUnit", {
                            juice: data.columns,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("updateWorkUnit", (data) => {
            if (clients[socket.id]) {
                User.findOneAndUpdate(
                    { _id: data.place, "workUnits.id": data.unit.id },
                    { $set: { "workUnits.$": data.unit } },
                    (dat) => {
                        io.to(data.place).emit("updateWorkUnit", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        socket.on("removeWorkUnit", (data) => {
            if (clients[socket.id]) {
                User.findOneAndUpdate(
                    { _id: data.place },
                    { $pull: { workUnits: { id: data.unitId } } },
                    () => {
                        io.to(data.place).emit("removeWorkUnit", {
                            juice: data,
                            source: socket.id,
                        });
                    }
                );
            }
        });
        //Auth
        socket.on("login", (token) => {
            validateSocket(socket, token);
        });
        socket.on("logout", (place) => {
            socket.leave(place);
            if (clients.hasOwnProperty(socket.id)) {
                clients[socket.id] = false;
            }
        });
        socket.on("disconnect", () => {
            if (clients.hasOwnProperty(socket.id)) {
                if (!clients[socket.id]) {
                    Session.findByIdAndUpdate(socket.id, {
                        closeTime: Date.now().toString(),
                    })
                        .then(() => {})
                        .catch((err) => {
                            console.log(err);
                        });
                }
                delete clients[socket.id];
            }
            console.log(
                `close ${socket.id} connection, number of authorized connections:`,
                NumberOfConnections()
            );
        });
    })
    .on("end", (socket) => {
        console.log("Server ended");
    });
