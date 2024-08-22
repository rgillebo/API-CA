const jwt = require('jsonwebtoken');

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 'fail',
            data: {
                statusCode: 401,
                result: 'No token provided, authorization denied.'
            }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 
        console.log(decoded); // Check the structure
        req.user = { UserId: decoded.UserId, email: decoded.email }; // Add the decoded user data to the request object
        next(); 
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            data: {
                statusCode: 401,
                result: 'Token is not valid.'
            }
        });
    }
}

module.exports = isAuth;
