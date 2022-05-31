const express = require("express");
const router = express.Router();
const passport = require("passport");
var Datauri = require("datauri");

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

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2.5 },
    fileFilter,
});
const Menu = require("../models/Menu");

//Create
router.post(
    "/newitem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findOneAndUpdate(
            { _id: req.body.menuId },
            { $push: { items: req.body.item } }
        )
            .then((item) => {
                return res.json({ success: true });
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    }
);
router.post(
    "/newcategory",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findOneAndUpdate(
            { _id: req.body.menuId },
            { $push: { categories: req.body.category } }
        )
            .then((category) => {
                return res.json({ success: true });
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    }
);
router.post(
    "/newmenu",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let newMenu = new Menu({
            name: req.body.name,
            place: req.body.place,
            _id: req.body._id,
            images: [],
            categories: [],
            items: [],
        });
        newMenu
            .save()
            .then((menu) => {
                return res.json(menu);
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    }
);

//Update
router.post(
    "/edititem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndUpdate(
            req.body.menuId,
            {
                $set: {
                    "items.$[item]": req.body.item,
                },
            },
            { arrayFilters: [{ "item.id": req.body.item.id }] }
        )
            .then(() => {
                return res.json({ success: true });
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ error: "Product couldn't be edited." });
            });
    }
);

router.post(
    "/editcategory",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndUpdate(
            req.body.menuId,
            {
                $set: {
                    "categories.$[category].name": req.body.category.name,
                },
            },
            { arrayFilters: [{ "category.id": req.body.category.id }] }
        )
            .then(() => {
                return res.json({ success: true });
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ error: "Product couldn't be edited." });
            });
    }
);
router.post(
    "/editmenu",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndUpdate(req.body.menu._id, {
            $set: {
                name: req.body.menu.name,
                images: req.body.menu.images,
            },
        })
            .then(() => {
                return res.json({ success: true });
            })
            .catch((err) => {
                console.error("There was an error", err);
                return res
                    .status(400)
                    .json({ error: "Product couldn't be edited." });
            });
    }
);

router.post(
    "/uploaditemimage",
    passport.authenticate("jwt", { session: false }),
    upload.single("itemImage"),
    (req, res) => {
        var dUri = new Datauri();
        let split = req.file.originalname.split("_", 5);
        let place = split[0];
        let menuId = split[1];
        let itemId = split[2];
        let uniqueFilename = split[3];
        dUri.format(".webp", req.file.buffer);
        cloudinary.uploader
            .upload(dUri.content, {
                public_id: `qrspots/${place}/menus/${menuId}/${itemId}/${uniqueFilename}`,
            })
            .then((image) => {
                Menu.findByIdAndUpdate(
                    menuId,
                    {
                        $push: {
                            "items.$[item].images": {
                                id: uniqueFilename,
                                url: image.url,
                            },
                        },
                    },
                    { arrayFilters: [{ "item.id": itemId }] }
                )
                    .then(() => {
                        return res.json({
                            id: uniqueFilename,
                            url: image.url,
                        });
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
    "/uploadmenuimage",
    passport.authenticate("jwt", { session: false }),
    upload.single("menuImage"),
    (req, res) => {
        var dUri = new Datauri();
        let split = req.file.originalname.split("_", 3);
        let place = split[0];
        let menuId = split[1];
        let uniqueFilename = split[2];
        dUri.format(".webp", req.file.buffer);
        cloudinary.uploader
            .upload(dUri.content, {
                public_id: `qrspots/${place}/menus/${menuId}/${uniqueFilename}`,
            })
            .then((image) => {
                Menu.findByIdAndUpdate(menuId, {
                    $push: {
                        images: { id: uniqueFilename, url: image.url },
                    },
                })
                    .then(() => {
                        return res.json({
                            id: uniqueFilename,
                            url: image.url,
                        });
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

//Delete

router.post(
    "/removeimage",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        cloudinary.uploader.destroy(req.body.address).then(() => {
            return res.json({ success: true });
        });
    }
);
router.post(
    "/removeitem",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndUpdate(req.body.menuId, {
            $pull: {
                items: {
                    id: req.body.itemId,
                },
            },
        })
            .then((item) => {
                cloudinary.api
                    .delete_resources_by_prefix([
                        `qrspots/${req.body.place}/menus/${req.body.menuId}/${req.body.itemId}/`,
                    ])
                    .then(() => {
                        cloudinary.api
                            .delete_folder(
                                `qrspots/${req.body.place}/menus/${req.body.menuId}/${req.body.itemId}`
                            )
                            .then(() => {
                                return res.json(item);
                            })
                            .catch((err) => {
                                return res.status(404).json(err);
                            });
                    })
                    .catch((err) => {
                        return res.status(404).json(err);
                    });
            })
            .catch((err) => {
                console.log(3);
                return res.status(404).json(err);
            });
    }
);
router.post(
    "/removecategory",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndUpdate(req.body.menuId, {
            $pull: {
                categories: {
                    id: req.body.categoryId,
                },
            },
        })
            .then((category) => {
                return res.json(category);
            })
            .catch((err) => {
                return res.status(404).json(err);
            });
    }
);
router.post(
    "/removemenu",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Menu.findByIdAndDelete(req.body.menuId)
            .then((menu) => {
                cloudinary.api
                    .delete_resources_by_prefix([
                        `qrspots/${req.body.place}/menus/${req.body.menuId}/`,
                    ])
                    .then(() => {
                        cloudinary.api
                            .delete_folder(
                                `qrspots/${req.body.place}/menus/${req.body.menuId}`
                            )
                            .then(() => {
                                return res.json(menu);
                            })
                            .catch((err) => {
                                return res.status(404).json(err);
                            });
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

module.exports = router;