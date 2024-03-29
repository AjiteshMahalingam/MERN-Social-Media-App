const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user)
            throw new Error();
        req.isAdmin = user.isAdmin;
        req.userId = user._id.toString();
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ "error": "Please Authenticate" });
    }
};

module.exports = auth;