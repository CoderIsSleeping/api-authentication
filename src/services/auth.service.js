const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const Token =require("../models/token.model");
const {generateAccessToken,generateRefreshToken}= require("../utils/token");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp.model");
const generateOTP =require("../utils/generateOTP");
const {
sendEmail
}= require("./email.service");
const crypto=require("crypto");



const registerUser = async(data)=>{


    const {
        name,
        email,
        password
    } = data;



    const existingUser =
    await User.findOne({email});


    if(existingUser){

        throw new Error(
        "User already exists"
        );

    }



    const hashedPassword =
    await bcrypt.hash(
        password,
        10
    );



    const user =
    await User.create({

        name,
        email,
        password:hashedPassword

    });

    // create OTP

    const otp =generateOTP();



    const hashedOTP =
    await bcrypt.hash(
        otp,
        10
    );



    await OTP.create({

        user:user._id,

        otp:hashedOTP,


        expiresAt:
        new Date(
            Date.now()
            +
            10*60*1000
        )

    });



    // send OTP

    await sendEmail(

        user.email,

        "Verify your email",

        `Your OTP is ${otp}`

    );

    return user;

};

const loginUser = async(data)=>{


const {
email,
password
}=data;



const user =
await User.findOne({email});


if(!user){

throw new Error(
"Invalid credentials"
);

}

if(
    !user.isEmailVerified
){

    throw new Error(
        "Please verify your email first"
    );

}



const isMatch =
await bcrypt.compare(
password,
user.password
);



if(!isMatch){

throw new Error(
"Invalid credentials"
);

}



const accessToken =generateAccessToken(user);

const refreshToken =generateRefreshToken(user);

await Token.create({

user:user._id,

refreshToken

});



return {
user,
accessToken,
refreshToken,
};

};

const refreshAccessToken = async(refreshToken)=>{


    if(!refreshToken){

        throw new Error(
        "Refresh token missing"
        );

    }


    // verify refresh token

    const decoded =
    jwt.verify(

        refreshToken,

        process.env.REFRESH_TOKEN_SECRET

    );



    // check token exists in DB

    const storedToken =
    await Token.findOne({

        refreshToken

    });



    if(!storedToken){

        throw new Error(
        "Invalid refresh token"
        );

    }



    const user =
    await User.findById(
        decoded.id
    );



    if(!user){

        throw new Error(
        "User not found"
        );

    }



    // remove old refresh token

    await Token.deleteOne({

        refreshToken

    });



    // create new tokens

    const newAccessToken =
    generateAccessToken(user);



    const newRefreshToken =
    generateRefreshToken(user);



    await Token.create({

        user:user._id,

        refreshToken:
        newRefreshToken

    });



    return {

        accessToken:
        newAccessToken,


        refreshToken:
        newRefreshToken

    };


};

const logoutUser = async(refreshToken)=>{


    if(!refreshToken){

        throw new Error(
            "No refresh token"
        );

    }



    await Token.deleteOne({

        refreshToken

    });



    return true;


};

const verifyEmailOTP =async(data)=>{


const {
email,
otp
}=data;



const user =
await User.findOne({
    email
});



if(!user){

throw new Error(
"User not found"
);

}



const otpRecord =
await OTP.findOne({

    user:user._id

});



if(!otpRecord){

throw new Error(
"OTP expired or invalid"
);

}



const isMatch =
await bcrypt.compare(

otp,

otpRecord.otp

);



if(!isMatch){

throw new Error(
"Wrong OTP"
);

}



user.isEmailVerified=true;


await user.save();



await OTP.deleteOne({

    user:user._id

});



return true;


};

const resendOTP = async(data)=>{


const {
email
}=data;



const user =
await User.findOne({
    email
});



if(!user){

    throw new Error(
    "User not found"
    );

}



if(
user.isEmailVerified
){

    throw new Error(
    "Email already verified"
    );

}



// remove previous OTP

await OTP.deleteMany({

    user:user._id

});



// create new OTP


const otp =
generateOTP();



const hashedOTP =
await bcrypt.hash(
    otp,
    10
);



await OTP.create({

user:user._id,


otp:hashedOTP,


expiresAt:

new Date(
Date.now()
+
10*60*1000
)


});



// send OTP


await sendEmail(

user.email,

"New verification OTP",

`Your new OTP is ${otp}`

);



return true;


};

const forgotPassword =async(data)=>{


const {
email
}=data;



const user =
await User.findOne({
    email
});



if(!user){

throw new Error(
"User not found"
);

}



// remove previous OTP

await OTP.deleteMany({

user:user._id

});



// create OTP

const otp =
generateOTP();



const hashedOTP =
await bcrypt.hash(
    otp,
    10
);



await OTP.create({

user:user._id,

otp:hashedOTP,


expiresAt:

new Date(

Date.now()

+

10*60*1000

)

});



await sendEmail(

user.email,

"Password Reset OTP",

`Your password reset OTP is ${otp}`

);



return true;


};

const verifyResetOTP =async(data)=>{


const {
email,
otp
}=data;



const user =
await User.findOne({
email
});



if(!user){

throw new Error(
"User not found"
);

}



const otpRecord =
await OTP.findOne({

user:user._id

});



if(!otpRecord){

throw new Error(
"OTP expired"
);

}



const match =
await bcrypt.compare(

otp,

otpRecord.otp

);



if(!match){

throw new Error(
"Wrong OTP"

);

}



// create reset token


const resetToken =
crypto
.randomBytes(32)
.toString("hex");



const hashedToken =
crypto

.createHash("sha256")

.update(resetToken)

.digest("hex");



user.passwordResetToken =
hashedToken;



user.passwordResetExpires =

Date.now()+15*60*1000;



await user.save();



await OTP.deleteOne({

user:user._id

});



return resetToken;


};

const resetPassword =async(data)=>{


const {

resetToken,

newPassword

}=data;



const hashedToken =
crypto

.createHash("sha256")

.update(resetToken)

.digest("hex");



const user =
await User.findOne({

passwordResetToken:
hashedToken,


passwordResetExpires:{

$gt:Date.now()

}


});



if(!user){

throw new Error(
"Invalid or expired reset token"
);

}



user.password =
await bcrypt.hash(

newPassword,

10

);



user.passwordResetToken =
undefined;



user.passwordResetExpires =
undefined;



await user.save();



return true;


};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    verifyEmailOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};