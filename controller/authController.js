const { user, Image } = require("../db/models/index");
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { logger, sdc } = require('../logger');
const { sendEmail } = require('../services/emailService');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


// --- Basic Authentication ---
const basicAuth = async (req, res, next) => {
    const startTime = Date.now();
    sdc.increment('auth.basicAuth.attempts');
  
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      logger.warn('Missing or invalid Authorization header');
      sdc.increment('auth.basicAuth.invalidHeader');
      sdc.timing('auth.basicAuth.time', Date.now() - startTime);
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
  
    // decoding Base64 encoded username and password
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
  
    if (!email || !password) {
      logger.warn('Email or password missing in authentication');
      sdc.increment('auth.basicAuth.missingCredentials');
      sdc.timing('auth.basicAuth.time', Date.now() - startTime);
      return res.status(401).json({ message: 'Neither Email nor password can be empty' });
    }
  
    try {
      const dbQueryStartTime = Date.now();
      const foundUser = await user.findOne({ where: { email: email } });
      sdc.timing('database.query.findUser', Date.now() - dbQueryStartTime);
  
      if (!foundUser) {
        logger.warn(`Authentication failed: User not found for email ${email}`);
        sdc.increment('auth.basicAuth.userNotFound');
        sdc.timing('auth.basicAuth.time', Date.now() - startTime);
        return res.status(401).json({ message: 'Authentication failed: User not found' });
      }
  
      const passwordCheckStartTime = Date.now();
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      sdc.timing('auth.basicAuth.passwordCheck', Date.now() - passwordCheckStartTime);
  
      if (!isPasswordValid) {
        logger.warn(`Authentication failed: Incorrect password for email ${email}`);
        sdc.increment('auth.basicAuth.invalidPassword');
        sdc.timing('auth.basicAuth.time', Date.now() - startTime);
        return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
      }
  
      req.user = foundUser;
      logger.info(`User ${email} authenticated successfully`);
      sdc.increment('auth.basicAuth.success');
      sdc.timing('auth.basicAuth.time', Date.now() - startTime);
      next();
    } catch (err) {
      logger.error('Error in authentication:', err);
      sdc.increment('auth.basicAuth.error');
      sdc.timing('auth.basicAuth.time', Date.now() - startTime);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };

// --- Signup Function ---
const signup = async (req, res) => {
    const startTime = Date.now();
    sdc.increment('auth.signup.attempts');
  
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    logger.info(`Signup attempt for email: ${email}`);
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      logger.warn('Signup failed: Missing required fields');
      sdc.increment('auth.signup.missingFields');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required: firstName, lastName, email, password, confirmPassword',
      });
    }
  
    if (password !== confirmPassword) {
      logger.warn('Signup failed: Password mismatch');
      sdc.increment('auth.signup.passwordMismatch');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'Password and confirm password must match',
      });
    }
  
    const nameValidation = /^[A-Za-z]+$/;
    if (!nameValidation.test(firstName) || !nameValidation.test(lastName)) {
      logger.warn('Signup failed: Invalid name format');
      sdc.increment('auth.signup.invalidNameFormat');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'First name and last name should contain only alphabets',
      });
    }
  
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
      logger.warn('Signup failed: Invalid email format');
      sdc.increment('auth.signup.invalidEmailFormat');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email format',
      });
    }
  
    try {
      const dbQueryStartTime = Date.now();
      const isOldUser = await user.findOne({ where: { email } });
      sdc.timing('database.query.findExistingUser', Date.now() - dbQueryStartTime);
  
      if (isOldUser) {
        logger.warn(`Signup failed: Email ${email} already in use`);
        sdc.increment('auth.signup.emailAlreadyUsed');
        sdc.timing('auth.signup.time', Date.now() - startTime);
        return res.status(400).json({
          status: 'fail',
          message: 'Email already used',
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const createUserStartTime = Date.now();
      const newUser = await user.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });
      sdc.timing('database.query.createUser', Date.now() - createUserStartTime);
  
      logger.info(`New user created: ${email}`);
      sdc.increment('auth.signup.success');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      const result = newUser.toJSON();
      if (newUser) {
        await sendEmail(
          newUser.email,
          'Welcome to Our App',
          'Thanks for signing up!',
          '<h1>Welcome to Our App</h1><p>We\'re glad you\'re here!</p>'
        );
      }
      return res.status(201).json({
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        account_created: result.account_created,
        account_updated: result.account_updated,
      });

  
    } catch (error) {
      logger.error('Error creating user:', error);
      sdc.increment('auth.signup.error');
      sdc.timing('auth.signup.time', Date.now() - startTime);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create user',
        error: error.message,
      });
    }
  };
  

// --- Update User Information Function ---
const updateUser = async (req, res) => {
    const startTime = Date.now();
    sdc.increment('auth.updateUser.attempts');
  
    const { firstName, lastName, password } = req.body;
    const email = req.user.email; // Email from authenticated user
  
    const nameValidation = /^[A-Za-z]+$/;
    if (firstName && !nameValidation.test(firstName)) {
      logger.warn('Update user failed: Invalid first name format');
      sdc.increment('auth.updateUser.invalidFirstNameFormat');
      sdc.timing('auth.updateUser.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'First name should contain only alphabets',
      });
    }
    if (lastName && !nameValidation.test(lastName)) {
      logger.warn('Update user failed: Invalid last name format');
      sdc.increment('auth.updateUser.invalidLastNameFormat');
      sdc.timing('auth.updateUser.time', Date.now() - startTime);
      return res.status(400).json({
        status: 'fail',
        message: 'Last name should contain only alphabets',
      });
    }
  
    try {
      const updates = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.password = hashedPassword;
      }
  
      const updateStartTime = Date.now();
      const [updatedRowsCount, [updatedUser]] = await user.update(updates, {
        where: { email },
        returning: true,
      });
      sdc.timing('database.query.updateUser', Date.now() - updateStartTime);
  
      if (updatedRowsCount === 0) {
        logger.warn(`Update user failed: User not found for email ${email}`);
        sdc.increment('auth.updateUser.userNotFound');
        sdc.timing('auth.updateUser.time', Date.now() - startTime);
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }
  
      logger.info(`User updated: ${email}`);
      sdc.increment('auth.updateUser.success');
      sdc.timing('auth.updateUser.time', Date.now() - startTime);
      return res.status(204).send();
    } catch (error) {
      logger.error('Error updating user:', error);
      sdc.increment('auth.updateUser.error');
      sdc.timing('auth.updateUser.time', Date.now() - startTime);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update user',
        error: error.message,
      });
    }
  };


// --- Load Details Function (Authenticated) ---
const loadDetails = (req, res) => {
    const startTime = Date.now();
    sdc.increment('auth.loadDetails.attempts');
  
    logger.info(`User details loaded for: ${req.user.email}`);
    sdc.increment('auth.loadDetails.success');
    sdc.timing('auth.loadDetails.time', Date.now() - startTime);
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      account_created: req.user.account_created,
      account_updated: req.user.account_updated,
    });
  };


// --- Upload Profile Picture Function (Authenticated) ---
// const uploadProfilePicture = async (req, res) => {
//     const startTime = Date.now();
//     sdc.increment('auth.uploadProfilePicture.attempts');

//     if (!req.file) {
//         logger.warn('Profile picture upload failed: No file provided');
//         sdc.increment('auth.uploadProfilePicture.noFile');
//         sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     const fileExtension = file.originalname.split('.').pop().toLowerCase();
//     const allowedExtensions = ['png', 'jpg', 'jpeg'];

//     if (!allowedExtensions.includes(fileExtension)) {
//         logger.warn(`Profile picture upload failed: Invalid file type - ${fileExtension}`);
//         sdc.increment('auth.uploadProfilePicture.invalidFileType');
//         sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
//         return res.status(400).json({ message: 'Invalid file type. Only png, jpg, and jpeg are allowed.' });
//     }

//     try {
//         const fileName = `${Date.now()}-${file.originalname}`;
//         const s3Key = `${req.user.id}/${fileName}`;

//         const s3Params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: s3Key,
//             Body: file.buffer,
//             ContentType: file.mimetype
//         };

//         const s3UploadStartTime = Date.now();
//         const uploadResult = await s3.upload(s3Params).promise();
//         sdc.timing('s3.upload.profilePicture', Date.now() - s3UploadStartTime);

//         const dbCreateStartTime = Date.now();
//         const image = await Image.create({
//             file_name: fileName,
//             url: `${process.env.S3_BUCKET_NAME}/${s3Key}`,
//             user_id: req.user.id
//         });
//         sdc.timing('database.query.createProfilePicture', Date.now() - dbCreateStartTime);

//         logger.info(`Profile picture uploaded for user: ${req.user.id}`);
//         sdc.increment('auth.uploadProfilePicture.success');
//         sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
//         res.status(201).json({
//             file_name: image.file_name,
//             id: image.id,
//             url: image.url,
//             upload_date: image.upload_date,
//             user_id: image.user_id
//         });
//     } catch (error) {
//         logger.error('Error uploading profile picture:', error);
//         sdc.increment('auth.uploadProfilePicture.error');
//         sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
//         res.status(500).json({ message: 'Error uploading profile picture' });
//     }
// };
const uploadProfilePicture = async (req, res) => {
    const startTime = Date.now();
    sdc.increment('auth.uploadProfilePicture.attempts');

    if (!req.file) {
        logger.warn('Profile picture upload failed: No file provided');
        sdc.increment('auth.uploadProfilePicture.noFile');
        sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg'];

    if (!allowedExtensions.includes(fileExtension)) {
        logger.warn(`Profile picture upload failed: Invalid file type - ${fileExtension}`);
        sdc.increment('auth.uploadProfilePicture.invalidFileType');
        sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
        return res.status(400).json({ message: 'Invalid file type. Only png, jpg, and jpeg are allowed.' });
    }

    try {
        // Check if user already has a profile picture
        const existingImage = await Image.findOne({ where: { user_id: req.user.id } });
        if (existingImage) {
            logger.warn(`Profile picture upload failed: User ${req.user.id} already has a profile picture`);
            sdc.increment('auth.uploadProfilePicture.alreadyExists');
            sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
            return res.status(400).json({ message: 'A profile picture already exists. Please delete the existing picture before uploading a new one.' });
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const s3Key = `${req.user.id}/${fileName}`;

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const s3UploadStartTime = Date.now();
        const uploadResult = await s3.upload(s3Params).promise();
        sdc.timing('s3.upload.profilePicture', Date.now() - s3UploadStartTime);

        const dbCreateStartTime = Date.now();
        const image = await Image.create({
            file_name: fileName,
            url: `${process.env.S3_BUCKET_NAME}/${s3Key}`,
            user_id: req.user.id
        });
        sdc.timing('database.query.createProfilePicture', Date.now() - dbCreateStartTime);

        logger.info(`Profile picture uploaded for user: ${req.user.id}`);
        sdc.increment('auth.uploadProfilePicture.success');
        sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
        res.status(201).json({
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.user_id
        });
    } catch (error) {
        logger.error('Error uploading profile picture:', error);
        sdc.increment('auth.uploadProfilePicture.error');
        sdc.timing('auth.uploadProfilePicture.time', Date.now() - startTime);
        res.status(500).json({ message: 'Error uploading profile picture' });
    }
};


// --- Delete Profile Picture Function (Authenticated) ---
const deleteProfilePicture = async (req, res) => {
    const startTime = Date.now();
    sdc.increment('api.deleteProfilePicture.calls');

    try {
        if (!req.user) {
            logger.warn('Unauthorized attempt to delete profile picture');
            sdc.increment('api.deleteProfilePicture.unauthorized');
            sdc.timing('api.deleteProfilePicture.time', Date.now() - startTime);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const dbFindStartTime = Date.now();
        const image = await Image.findOne({ where: { user_id: req.user.id } });
        sdc.timing('database.query.findProfilePicture', Date.now() - dbFindStartTime);

        if (!image) {
            logger.warn(`No profile picture found for user: ${req.user.id}`);
            sdc.increment('api.deleteProfilePicture.notFound');
            sdc.timing('api.deleteProfilePicture.time', Date.now() - startTime);
            return res.status(404).json({ message: 'Not Found' });
        }

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${req.user.id}/${image.file_name}`
        };

        const s3DeleteStartTime = Date.now();
        await s3.deleteObject(s3Params).promise();
        sdc.timing('s3.delete.profilePicture', Date.now() - s3DeleteStartTime);
        sdc.increment('s3.delete.profilePicture.success');

        const dbDeleteStartTime = Date.now();
        await image.destroy();
        sdc.timing('database.delete.profilePicture', Date.now() - dbDeleteStartTime);
        sdc.increment('database.delete.profilePicture.success');

        logger.info(`Profile picture deleted for user: ${req.user.id}`);
        sdc.increment('api.deleteProfilePicture.success');
        sdc.timing('api.deleteProfilePicture.time', Date.now() - startTime);
        return res.status(204).send();
    } catch (error) {
        logger.error('Error deleting profile picture:', error);
        sdc.increment('api.deleteProfilePicture.error');
        sdc.timing('api.deleteProfilePicture.time', Date.now() - startTime);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// --- Get Profile Picture Function (Authenticated) ---
const getProfilePicture = async (req, res) => {
    const startTime = Date.now();
    sdc.increment('auth.getProfilePicture.attempts');
  
    try {
      const dbQueryStartTime = Date.now();
      const image = await Image.findOne({ where: { user_id: req.user.id } });
      sdc.timing('database.query.findProfilePicture', Date.now() - dbQueryStartTime);
  
      if (!image) {
        logger.warn(`Profile picture not found for user: ${req.user.id}`);
        sdc.increment('auth.getProfilePicture.notFound');
        sdc.timing('auth.getProfilePicture.time', Date.now() - startTime);
        return res.status(404).json({ message: 'Profile picture not found' });
      }
  
      logger.info(`Profile picture retrieved for user: ${req.user.id}`);
      sdc.increment('auth.getProfilePicture.success');
      sdc.timing('auth.getProfilePicture.time', Date.now() - startTime);
      res.status(200).json({
        file_name: image.file_name,
        id: image.id,
        url: image.url,
        upload_date: image.upload_date,
        user_id: image.user_id
      });
    } catch (error) {
      logger.error('Error retrieving profile picture:', error);
      sdc.increment('auth.getProfilePicture.error');
      sdc.timing('auth.getProfilePicture.time', Date.now() - startTime);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = { signup, loadDetails, basicAuth, updateUser, uploadProfilePicture, deleteProfilePicture, getProfilePicture };

