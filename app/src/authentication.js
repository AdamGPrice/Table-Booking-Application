const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get the token form Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);  // return 401 unauthorized if token exists
    };

    jwt.verify(token, process.env.TOKEN_SECRET, (err, account) => {
        req.account = account;      // Add account data to the req show we can access user information
        next();                     // Go the actual request the user made
    });
};

function generateAccessToken(account) {
    account = JSON.stringify(account);
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 Day token
        data: account
    }, process.env.TOKEN_SECRET);
}

function accountTypeUser(req, res, next) {
    
}

function accountTypeBusiness(req, res, next) {
    
}

module.exports = {
    authenticateToken,
    generateAccessToken
}