const Customers=require("./../Models/customerSchema");
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
 require('dotenv').config();

module.exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  const customer = await Customers.findOne({ customerEmail:email });
  if (customer) {
    try {
        const validPassword = await bcrypt.compare(password, customer.customerPassword);
        console.log(validPassword);
        if (validPassword) {
          const token = jwt.sign(
            {_id:customer._id} 
            , process.env.SECRET);  
          res.status(200).json({ login: "success",customer,token: token });
        } else res.status(400).send(`your password is incorrect`);
      
    } catch (error) {
      res.status(400).send(`login error:${error}`);
    }
  }}