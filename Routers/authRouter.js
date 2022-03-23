const express=require("express");
const {loginController}=require("./../Controllers/authController")
const router=express.Router();

router.post("/login",loginController)
 module.exports=router;