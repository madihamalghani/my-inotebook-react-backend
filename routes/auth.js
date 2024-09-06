const express = require('express');
const router = express.Router();
const User = require('../models/User');
// npm isntall express-validator:
const { body, validationResult } = require('express-validator');
// for security purpose:using pacakage npm i bcryptjs
const bcrypt = require('bcrypt');
// giving token using: npm i jsonwebtoken
// jwt: jsonwebtoken : a way to verify a user
// require('dotenv').config();
// const jwt_secret = process.env.jwt_secret;
var jwt = require('jsonwebtoken');
 const jwt_secret ="hd";
const fetchuser = require('../middleware/fetchuser'); 

// route #1
router.post('/createuser', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),

], async (req, res) => {
    let success=false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10); // Removed 'Sync' to use the async version
        const secPass = await bcrypt.hash(req.body.password, salt); // Removed 'Sync' to use the async version

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        // const jwt_secret = 'hdshvc';//this is sensitive data save it in private environment

        const authToken = jwt.sign(data, jwt_secret);

        let success=true;
        res.json({success, authToken })
        // res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Some Error Occured' });
    }
});
// authenticate a user(already present): /api/auth/login   
// ROUTE#2
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    // body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('password').exists().withMessage('Password can not be blank'),

], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        // This should ideally be stored in environment variables
        const jwt_secret = 'hd';
        // const jwt_secret = process.env.jwt_secret;

        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({ error: "plz try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
        success=false;
            return res.status(400).json({success, error: "plz try to login with correct credentials" })

        }
        // user's data:
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_secret);
        success=true;
        res.json({success, authToken })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
})
// Route#3 Get loggedin user Detail ./api/auth/getuser (login required)
router.post('/getuser',fetchuser, async (req, res) => {
try {
    const userId=req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
} catch (error) {
    console.log(error);
        return res.status(500).send({ error: 'Internal Server Error' }); 
}
})

module.exports = router;
