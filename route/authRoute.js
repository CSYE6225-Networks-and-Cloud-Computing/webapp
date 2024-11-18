const express = require('express');
const multer = require('multer');
const { signup, loadDetails, basicAuth, verifyEmail, checkVerified, updateUser, uploadProfilePicture, deleteProfilePicture, getProfilePicture } = require('../controller/authController');
const setHeaders = require('../middleware/setHeaders');

const router = express.Router();
router.use(setHeaders);

const upload = multer({ storage: multer.memoryStorage() });

// router.route('/').post(signup);
router.post('/', (req, res) => signup(req, res, req.apiVersion));
router.route('/self/verify')
  .get(verifyEmail);

  
// unsupported methods on /self
router.route('/self')
  .delete((req, res) => res.status(405).send())  // DELETE not allowed
  .patch((req, res) => res.status(405).send())   // PATCH not allowed
  .head((req, res) => res.status(405).send())    // HEAD not allowed
  .options((req, res) => res.status(405).send()); // OPTIONS not allowed

router.route('/self')
  .get(basicAuth, checkVerified, loadDetails)
  .put(basicAuth, checkVerified, updateUser)

router.route('/self/pic')
  // .delete((req, res) => res.status(405).send())  // DELETE not allowed
  .patch((req, res) => res.status(405).send())   // PATCH not allowed
  .head((req, res) => res.status(405).send())    // HEAD not allowed
  .options((req, res) => res.status(405).send()) // OPTIONS not allowed
  .put((req, res) => res.status(405).send());    // PUT not allowed


router.route('/self/pic')
  .get(basicAuth, checkVerified, getProfilePicture)
  .post(basicAuth, checkVerified, upload.single('image'), uploadProfilePicture)
  .delete(basicAuth, checkVerified, deleteProfilePicture)

// router.get('/verify', verifyEmail);

module.exports = router;
