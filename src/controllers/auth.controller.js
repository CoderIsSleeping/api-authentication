const authService =require("../services/auth.service");
const asyncHandler =require("../utils/asyncHandler");


const signup = asyncHandler(
    async(req,res)=>{


    const user =
    await authService.registerUser(
        req.body
    );



    res.status(201).json({

        success:true,

        message:
        "User created successfully",


        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }


    });


}
);

const login = asyncHandler(
    async(req,res)=>{

    const result =
    await authService.loginUser(
    req.body
    );

    res.cookie(

    "refreshToken",

    result.refreshToken,

    {

    httpOnly:true,

    secure:true,
    sameSite:"strict",

    maxAge:
    7*24*60*60*1000

    }

    );

    res.status(200).json({

    success:true,

    message:"Login successful",

    accessToken:
    result.accessToken,


    user:{
    id:result.user._id,
    name:result.user.name,
    email:result.user.email
    }
        
    });
    }
);

const refreshToken = asyncHandler(
async(req,res)=>{

    console.log(
    "ALL COOKIES:",
    req.cookies
);

const token =
req.cookies.refreshToken;



const result =
await authService.refreshAccessToken(
token
);



res.cookie(

"refreshToken",

result.refreshToken,

{

httpOnly:true,

secure:false,

sameSite:"strict",

maxAge:
7*24*60*60*1000

}

);



res.status(200).json({

success:true,

accessToken:
result.accessToken

});


}
);

const logout = asyncHandler(
async(req,res)=>{


    const token =
    req.cookies.refreshToken;



    await authService.logoutUser(
        token
    );



    res.clearCookie(
        "refreshToken"
    );



    res.status(200).json({

        success:true,

        message:
        "Logged out successfully"

    });



}
);

const verifyEmail =asyncHandler(
async(req,res)=>{

await authService.verifyEmailOTP(
    req.body
);



res.status(200).json({

success:true,

message:
"Email verified successfully"

});



}


);

const resendVerificationOTP =asyncHandler(
async(req,res)=>{

await authService.resendOTP(
    req.body
);



res.status(200).json({

success:true,

message:
"OTP sent successfully"

});



}

);

const forgotPassword =asyncHandler(
async(req,res)=>{

await authService.forgotPassword(
req.body
);


res.json({

success:true,

message:"OTP sent"

});


}


);

const verifyResetOTP =asyncHandler(
async(req,res)=>{

const token =
await authService.verifyResetOTP(
req.body
);



res.json({

success:true,

resetToken:token

});


}

);

const resetPassword =asyncHandler(
async(req,res)=>{



await authService.resetPassword(
req.body
);



res.json({

success:true,

message:
"Password updated"

});


}

);

module.exports={
    signup,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerificationOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};
