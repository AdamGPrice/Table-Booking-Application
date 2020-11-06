const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get the token form Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);  // return 401 unauthorized if token exists
    };

    jwt.verify(token, process.env.TOKEN_SECRET, (err, account) => {
        req.account = JSON.parse(account.data); // Add account data to the req so we can access it
        next();                                 // Go the actual request the user made
    });
};

function generateAccessToken(account) {
    account = JSON.stringify(account);
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 Day token
        data: account
    }, process.env.TOKEN_SECRET);
}

function isOwner(req, res, next) {
    if (req.account.type == 'owner') {
        next();
    } else {
        res.sendStatus(401);
    }
}

function isUser(req, res, next) {
    if (req.account.type == 'user') {
        next();
    } else {
        res.sendStatus(401);
    }
}


module.exports = {
    authenticateToken,
    generateAccessToken,
    isOwner,
    isUser
}