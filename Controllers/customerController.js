const Customers = require("../Models/customerSchema");
const Addresses=require('../Models/addressSchema');
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

module.exports = {
  getAllOrOne: async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      try {
        const allCustomer = await Customers.find({}).populate({path:"customerAddresses"});
        res.status(200).json(allCustomer);
      } catch (error) {
        next(`cannot get all customers:${error}`);
      }
    } else {
      try {
        const customer = await Customers.findOne({ _id:id }).populate({path:"customerAddresses"});
        if (customer) {
          res.status(200).json(customer);
        } else res.status(400).json({ customer: "not Found" });
      } catch (error) {
        next(error);
      }
    }
  }, //get all or one customer

  addCustomer:(req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error=new Error();
      error.status=422;
      error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
      throw error;
    }
        let {
          customerPassword,
          customerPhone,
          fullName,
          customerEmail,
          customerTotalPurchase,
          role,
        } = req.body;
        
        let customerAddresses=JSON.parse(req.body.customerAddresses);
        let Orders=JSON.parse(req.body.Orders);

        console.log(customerAddresses);
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(customerPassword, salt);
          customerPassword = hashedPassword;
          const customer = new Customers({
            customerPassword,
            customerPhone,
            fullName,
            customerEmail,
            image:"http://localhost:8080/images/"+req.file.filename,
            customerTotalPurchase,
            Orders,
            role,
          });
          customer.save()
          .catch(error=>next(error+"cannot add customer")); 
          
          let address;
          
          for (let i = 0; i < customerAddresses.length; i++) {
           address=new Addresses({
            country:customerAddresses[i].country,
            city:customerAddresses[i].city,
            streetName:customerAddresses[i].streetName,
            buildingNumber:customerAddresses[i].buildingNumber,
            floorNumber:customerAddresses[i].floorNumber,
            addressOwnerId:customer._id,
          });
          address.save()
          .then(customer.customerAddresses.push(address._id)) 
          .catch(error=>next(error+"cannot add this address"))
        }
           
           res.status(200).json({message:"adedd",customer});                         

  }, //add customer

  updateCustomer:async(req, res, next) => {    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error=new Error();
      error.status=422;
      error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
      throw error;
    }
    Customers.updateOne({_id:req.params.id}, {
      $set: {
        customerPassword: req.body.customerPassword,
        customerPhone: req.body.customerPhone,
        fullName: req.body.fullName,
        image: "http://localhost:8080/images/"+req.file.filename,
        customerTotalPurchase: req.body.customerTotalPurchase,
        Orders: req.body.Orders,
        customerAddresses: req.body.customerAddresses,
        role: req.body.role,
      }
    })
      .then((data) => {
        if (data == null) throw new Error("cannot update this customer");
        res.status(200).json({ message: "updated", data });
      }).catch((error) => next(error));
    
  },

  
  deleteCustomer:async(req,res,next)=>{
    const {id} = req.params;
    const customer =Customers.findOne({_id:id});
    if(!customer){
    next("cannot find this customer");
    }else{
    try {
      const data = await Customers.deleteOne({ _id: id });
                   await Addresses.deleteOne({addressOwnerId:id});
      res.send({ msg: "deleted", data });
    } catch (err) {
      next(err.message);
    }
  }  
  }


};
