const express = require('express');
const { signup, loadDetails, basicAuth, updateUser } = require('../controller/authController');
const setHeaders = require('../middleware/setHeaders');

const router = express.Router();
router.use(setHeaders);

router.route('/').post(signup); // create user

// unsupported methods on /self
router.route('/self')
  .delete((req, res) => res.status(405).send())  // DELETE not allowed
  .patch((req, res) => res.status(405).send())   // PATCH not allowed
  .head((req, res) => res.status(405).send())    // HEAD not allowed
  .options((req, res) => res.status(405).send()); // OPTIONS not allowed

router.route('/self')
.get(basicAuth, loadDetails)  // view user details
.put(basicAuth, updateUser);  // update user

module.exports = router;
