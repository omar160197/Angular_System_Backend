const {mongoose} = require('mongoose');
const addressSchema =new mongoose.Schema({

country:{type:String,required:true},
city:{type:String,required:true},
streetName:{type:String,required:true},
buildingNumber:{type:Number,required:true},
floorNumber:{type:Number,required:true},
addressOwnerId:{type:mongoose.Schema.Types.ObjectId ,required:true}  
  
});


  //2-register for schema in mongoos
  const Addresses=mongoose.model("Addresses", addressSchema);
  module.exports = Addresses;