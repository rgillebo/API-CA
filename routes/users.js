var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jsend = require('jsend');
var { User } = require('../models'); 

router.use(jsend.middleware);

// Post for new users to register / signup
router.post('/signup', async (req, res) => {
// #swagger.tags = ['Users']
/* #swagger.path = '/users/signup'  
*/
// #swagger.description = 'Endpoint to register a new user'
/* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'User Information',
    schema: { $ref: "#/definitions/NewUser" }
 } */
// #swagger.responses[201] = { description: "User registered successfully." }
// #swagger.responses[400] = { description: "Email and password are required." }
// #swagger.responses[500] = { description: "Server error" }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.jsend.fail({ statusCode: 400, message: 'Email and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.jsend.fail({ statusCode: 400, message: 'Email already in use.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({
            email: email,
            password: hashedPassword
        });

        return res.jsend.success({ statusCode: 201, user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        return res.status(500).jsend.error({ message: error.message });
    }
});


// Post for registered users to be able to login
router.post('/login', async (req, res) => {
// #swagger.tags = ['Users']
/* #swagger.path = '/users/login'  
*/
// #swagger.description = 'Endpoint for user login'
/* #swagger.parameters['obj'] = {
        in: 'body',
        description: 'User Login Information',
        schema: { $ref: "#/definitions/UserLogin" }
} */
// #swagger.responses[200] = { description: "Login successful" }
// #swagger.responses[401] = { description: "Unauthorized. Invalid email or password." }
// #swagger.responses[500] = { description: "Error processing login request." }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.jsend.fail({ statusCode: 400, message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.jsend.fail({ statusCode: 401, message: 'Invalid email or password.' });
        }

        const isEqual = await bcrypt.compare(password, user.encryptedPassword.toString('utf8'));
        if (!isEqual) {
            return res.jsend.fail({ statusCode: 401, message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { UserId: user.id, email: user.email },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        return res.jsend.success({ token: token, UserId: user.id });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).jsend.error({ message: 'Error processing login request.' });
    }
});

router.get('/fail', (req, res) => {
// #swagger.tags = ['Users']
/* #swagger.path = '/users/fail'  
*/
// #swagger.description = 'Unauthorized access endpoint'
// #swagger.responses[401] = { description: "Unauthorized access" }
    return res.status(401).jsend.error({ statusCode: 401, message: 'Unauthorized access.', data: null });
});

module.exports = router;