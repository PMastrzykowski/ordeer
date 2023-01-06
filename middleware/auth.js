const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(400).json({ success: false, msg: "Lacking authentication token." });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                //auth token wygasł
                return res.status(403).json({ success: false, msg: err.message });
            }
            //auth token poprawny, lecimy dalej
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = auth;
