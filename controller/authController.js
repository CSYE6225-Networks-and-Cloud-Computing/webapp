// const user = require("../db/models/user");
const {user} = require("../db/models/index");
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// --- Basic Authentication ---
const basicAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({
            message: 'Missing or invalid Authorization header'
        });
    }

    // decoding Base64 encoded username and password
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    // email and password validation
    if (!email || !password) {
        return res.status(401).json({
            message: 'neither Email nor password can be empty'
        });
    }

    // authenticating the user
    user.findOne({ where: { email: email } })
        .then(async (foundUser) => {
            if (!foundUser) {
                return res.status(401).json({ message: 'Authentication failed: User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, foundUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
            }

            // if the credentials are valid
            req.user = foundUser;
            next();
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Internal server error', error: err });
        });
};

// --- Signup Function ---
const signup = async (req, res) => {
    console.log("........you have entered signup at this point........");
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    console.log("........you have crossed const at this point........");
    // validating required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required: firstName, lastName, email, password, confirmPassword',
        });
    }

    // validating if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'Password and confirm password must match',
        });
    }

    // validating if first name and last name fields are only alphabets
    const nameValidation = /^[A-Za-z]+$/;
    if (!nameValidation.test(firstName)) {
        return res.status(400).json({
            status: 'fail',
            message: 'First name should contain only alphabets',
        });
    }
    if (!nameValidation.test(lastName)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Last name should contain only alphabets',
        });
    }

    // validating if email entered is in the correct format
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid email format',
        });
    }

    try {
        // checking if the email already exists
        const isOldUser = await user.findOne({ where: { email } });
        console.log(isOldUser);
        console.log("........you have reached this point........");
        if (isOldUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already used',
            });
        }

        // hashing the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("........you have reached this point.......hashed Pass: .",hashedPassword);
        // creating a new user with the hashed password and all the details
        const newUser = await user.create({
            firstName,
            lastName,
            email,
            password: hashedPassword  // saving the hashed password
        });

        const result = newUser.toJSON();
        console.log("........you have reached this point.......hashed Pass: .",newUser);
        return res.status(201).json({
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            account_created: result.account_created,
            account_updated: result.account_updated,
        });      

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: 'Failed to create user',
            error: error.message,
        });
    }
};

// --- Update User Information Function ---
const updateUser = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    // validating required fields
    if (!email) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email is required',
        });
    }

    // validating that the new first name and last name fields (if entered) are in correct format
    const nameValidation = /^[A-Za-z]+$/;
    if (!nameValidation.test(firstName)) {
        return res.status(400).json({
            status: 'fail',
            message: 'First name should contain only alphabets',
        });
    }
    if (!nameValidation.test(lastName)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Last name should contain only alphabets',
        });
    }

    try {
        // finding the user by email
        const foundUser = await user.findOne({ where: { email } });

        if (!foundUser) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'Cannot update email',
            });
        }

        // only allow updating specific fields
        const updates = {};
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // hashing the new password
            updates.password = hashedPassword;
        }

        // updating the user and setting the account_updated field to the current date
        await foundUser.update({
            ...updates,
            account_updated: new Date(),
        });

        return res.status(204).json({
            status: 'success',
            data: {
                id: foundUser.id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                account_updated: foundUser.account_updated,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: 'Failed to update user',
            error: error.message,
        });
    }
};

// --- Load Details Function (Authenticated) ---
const loadDetails = (req, res) => {
    res.json({
        
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            account_created: req.user.account_created,
            account_updated: req.user.account_updated,
        
    });
};

module.exports = { signup, loadDetails, basicAuth, updateUser };