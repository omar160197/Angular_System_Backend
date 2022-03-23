const { mongoose } = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullName:{type:String,required:true},
  customerPhone: { type: Number, required: true },
  customerEmail: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "Please enter a valid email",
    ],
  },
  
  image:String,
  customerPassword: { type: String, required: true },
  confirmPassword:{ type: String, required: false },
  customerTotalPurchase: { type: Number, required: true },
  
  Orders: [{ type: Number, ref: "Orders" }],
  
  customerAddresses: [{type:mongoose.Schema.Types.ObjectId ,ref: "Addresses"}],

  role: {type:String, enum: ["Doctor", "Merchant"], required: true },

});



//2-register for schema in mongoos
const Customers=mongoose.model("Customers", customerSchema);
module.exports = Customers;