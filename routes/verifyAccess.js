const jwt = require('jsonwebtoken')
const db = require('../config/index');
const jwtSecret = db.jwtSecret;

function verifyToken(req,res,next) {
    const token = req.cookies.token || '' 

    if (!token) {
        console.log('Please log in')
        return res.redirect('/login')
    }
    // Validar el token 
    else {
        jwt.verify(token, jwtSecret, function(err, data){
            if (err){
                console.log('Your token is invalid, sending you to login')
                console.log(err)
                return res.redirect('/login')
            } else {
                // Checking to see if user has permission to access this page
                if (req.adminsOnly) {
                    if (data.isAdministrator) {
                        req.isAdmin = data.isAdministrator;
                        req.userId = data.id;
                        next();
                    } else {
                        console.log('You cannot access this page');
                        return res.redirect('/');
                    }
                } else {
                    req.isAdmin = data.isAdministrator;
                    req.userId = data.id;
                    next();
                }
            }
        })
    }
}

module.exports = verifyToken