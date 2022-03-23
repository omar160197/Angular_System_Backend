const router = require("express").Router();
const isAuth = require('../Middlewares/AuthMW')
const {
  getAllOrOne,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../Controllers/customerController");
const {
  validatePostData,
  validatePutData,
  validateDeleteData,
} = require("../Services/customerValidator");

router
  .route("/customer/:id?")
  .get(isAuth,getAllOrOne)
  .post(validatePostData(), addCustomer)
  .put(validatePutData(), updateCustomer)
  .delete( deleteCustomer);

module.exports = router;
