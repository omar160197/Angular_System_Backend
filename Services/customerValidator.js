const { body, check,param } = require("express-validator");

const Customers = require("../Models/customerSchema");

/*------------------------------------- post --------------------------------------*/


module.exports.validatePostData = () => {
  return [
    body("fullName")
      .isString()
      .withMessage("//name is required and must be alpha"),
     
    body("customerPassword")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage("//password min length: 8 "),

    body("confirmPassword")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value === req.body.customerPassword) return true;
        return false;
      })
      .withMessage("//confirmPassword min length: 8"),

    body("customerEmail")
      .isEmail()
      .custom((value) => {
        return Customers.findOne({ customerEmail: value })
         .then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      }).withMessage("//E-mail already in use"),
      
    body("customerAddresses") 
    .isString()
    .not()
    .isEmpty()
    .withMessage("//enter customerAddresses as Array not empty"),

    check("customerAddresses.*.country")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//country is string"),

    check("customerAddresses.*.city")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//city is string"),

    check("customerAddresses.*.streetName")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//streetName is string"),

    check("customerAddresses.*.buildingNumber")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("//buildingNumber is number"),

    check("customerAddresses.*.floorNumber")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("// floorNumber is number"),

    body("role")
    .isString()
    .isIn(['Doctor', 'Merchant'])
    .withMessage("//select your role Merchant or Doctor"),

    body("Orders")
    .isString().withMessage("select your order"),

    body("customerTotalPurchase")
      .isInt()
      .withMessage("//select your customerTotalPurchase"),
    body("customerPhone").isInt().withMessage("please enter valid phone"),
  ];
};


/*------------------------------------- put --------------------------------------*/
module.exports.validatePutData = () => {
  return [
    param("id")
    .custom((value)=>{
      return Customers.findOne({_id:value})
      .then(user=>{
            if(!user) return Promise.reject("cannot find this customer"); 
      });
    }).withMessage("cannot find this customer"),

    body("fullName")
      .isString()
      .withMessage("//name is required and must be alpha"),

    body("customerPassword")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage("//password min length: 8 "),

    body("confirmPassword")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value === req.body.customerPassword) return true;
        return false;
      })
      .withMessage("//confirmPassword min length: 8"),

    body("customerAddresses")
    .isArray()
    .not()
    .isEmpty()
    .withMessage("//enter customerAddresses as Array not empty"),

    check("customerAddresses.*.country")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//country is string"),  

    check("customerAddresses.*.city")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//city is string"),

    check("customerAddresses.*.streetName")
      .not()
      .isEmpty()
      .isString()
      .withMessage("//streetName is string"),

    check("customerAddresses.*.buildingNumber")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("//buildingNumber is number"),

    check("customerAddresses.*.floorNumber")
      .not()
      .isEmpty()
      .isInt()
      .withMessage("// floorNumber is number"),

    body("role")
    .isString()
    .isIn(['Doctor', 'Merchant'])
    .withMessage("//select your role Merchant or Doctor"),

    body("Orders").isArray().withMessage("select your order"),

    body("customerTotalPurchase")
      .isInt()
      .withMessage("//select your customerTotalPurchase"),
    body("image").isString().withMessage("please enter valid image"),
    body("customerPhone").isInt().withMessage("please enter valid phone"),
  ];
};


/*------------------------------------- delete --------------------------------------*/

module.exports.validateDeleteData = () => {
  return body("_id").isObject().withMessage("id is only number");
};
