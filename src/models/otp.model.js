const mongoose = require("mongoose");


const otpSchema =
new mongoose.Schema(
{

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},


otp:{
    type:String,
    required:true
},


expiresAt:{
    type:Date,
    required:true,
    expires:0
}


},
{
timestamps:true
}
);



module.exports =
mongoose.model(
"OTP",
otpSchema
);