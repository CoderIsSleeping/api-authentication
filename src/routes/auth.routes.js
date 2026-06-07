const express = require("express");

const router = express.Router();


const {
signup,login,refreshToken,logout,verifyEmail,resendVerificationOTP,forgotPassword,verifyResetOTP,resetPassword
}
= require("../controllers/auth.controller");

const validate =
require("../middleware/validate.middleware");


const {

signupSchema,

loginSchema

}=require("../validations/auth.validation");


router.post(
"/signup",
validate(signupSchema),
signup
);

router.post(
"/login",
validate(loginSchema),
login
);

router.post(
"/refresh",
refreshToken
);

router.post(
"/logout",
logout
);

router.post(
"/verify-email",
verifyEmail
);

router.post(
"/resend-otp",
resendVerificationOTP
);

router.post(
"/forgot-password",
forgotPassword
);

router.post(
"/verify-reset-otp",
verifyResetOTP
);

router.post(
"/reset-password",
resetPassword
);

module.exports=router;