const jwt = require('jsonwebtoken');
const db = require('./mysql');

const pubQueries = require('./services/pubs/pubs.queries');

function authenticateToken(req, res, next) {
    // Get the token form Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);  // return 401 unauthorized if token exists
    };
    const environment = process.env.NODE_ENV || 'dev';
    let secret = process.env.LOCAL_SECRET_TOKEN;
    if (environment == 'prod') {
        secret = process.env.PROD_SECRET_TOKEN
    }

    jwt.verify(token, secret, (err, account) => {
        // If there is an error assume token is no longer valid and return authenticated
        if (err) {
            res.status(401);
            res.json({
                status: res.statusCode,
                message: 'JSON Web Token is no longer valid, please re-authenticate.'
            })
        } else {
            req.account = JSON.parse(account.data); // Add account data to the req so we can access it
            next();                                 // Go the actual request the user made
        }
    });
};

function generateAccessToken(account) {
    const environment = process.env.NODE_ENV || 'dev';
    let secret = process.env.LOCAL_SECRET_TOKEN;
    if (environment == 'prod') {
        secret = process.env.PROD_SECRET_TOKEN
    }

    account = JSON.stringify(account);
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 1 Week token
        data: account
    }, secret);
}

// Check if the account making the requst is type owner
function isOwner(req, res, next) {
    if (req.account.type == 'owner') {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Check if the account making the requst is type user
function isUser(req, res, next) {
    if (req.account.type == 'user') {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Check if the owner making the request owns the pub
async function isPubOwner(req, res, pub_id) {
    const pub = await pubQueries.getById(pub_id);
    if (pub != undefined) {
        if (pub.owner_id == req.account.id) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


module.exports = {
    authenticateToken,
    generateAccessToken,
    isOwner,
    isPubOwner,
    isUser
}